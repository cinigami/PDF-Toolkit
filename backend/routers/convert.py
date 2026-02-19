import zipfile
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from services.converter import convert_to_pdf, is_supported
from utils.file_cleanup import create_job_dir

router = APIRouter(prefix="/api", tags=["convert"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


@router.post("/convert")
async def convert_files(files: list[UploadFile] = File(...)):
    """Convert uploaded files to PDF. Returns a single PDF or ZIP of PDFs."""
    if not files:
        raise HTTPException(400, "No files uploaded")

    job_dir = create_job_dir()
    input_dir = job_dir / "input"
    output_dir = job_dir / "output"
    input_dir.mkdir()
    output_dir.mkdir()

    converted = []

    for f in files:
        if not is_supported(f.filename):
            raise HTTPException(400, f"Unsupported file type: {f.filename}")

        # Read and check size
        content = await f.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(400, f"File too large: {f.filename} (max 50MB)")

        input_path = input_dir / f.filename
        input_path.write_bytes(content)

        stem = Path(f.filename).stem
        output_path = output_dir / f"{stem}.pdf"

        try:
            convert_to_pdf(input_path, output_path)
            converted.append(output_path)
        except Exception as e:
            raise HTTPException(500, f"Failed to convert {f.filename}: {str(e)}")

    # Single file — return directly
    if len(converted) == 1:
        return FileResponse(
            converted[0],
            media_type="application/pdf",
            filename=converted[0].name,
        )

    # Multiple files — return as ZIP
    zip_path = job_dir / "converted.zip"
    with zipfile.ZipFile(zip_path, "w") as zf:
        for pdf in converted:
            zf.write(pdf, pdf.name)

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename="converted.zip",
    )
