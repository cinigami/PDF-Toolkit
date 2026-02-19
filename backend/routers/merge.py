from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from services.merger import merge_pdfs
from utils.file_cleanup import create_job_dir

router = APIRouter(prefix="/api", tags=["merge"])

MAX_FILE_SIZE = 50 * 1024 * 1024


@router.post("/merge")
async def merge(
    files: list[UploadFile] = File(...),
    order: str = Form(default=""),  # comma-separated indices for custom ordering
):
    """Merge multiple PDFs into one. Optional `order` param for custom ordering."""
    if len(files) < 2:
        raise HTTPException(400, "At least 2 PDF files are required")

    job_dir = create_job_dir()
    input_dir = job_dir / "input"
    input_dir.mkdir()

    saved_paths = []
    for f in files:
        if not f.filename.lower().endswith(".pdf"):
            raise HTTPException(400, f"Only PDF files accepted, got: {f.filename}")

        content = await f.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(400, f"File too large: {f.filename} (max 50MB)")

        path = input_dir / f"{len(saved_paths)}_{f.filename}"
        path.write_bytes(content)
        saved_paths.append(path)

    # Apply custom ordering if provided
    if order.strip():
        try:
            indices = [int(i.strip()) for i in order.split(",")]
            saved_paths = [saved_paths[i] for i in indices]
        except (IndexError, ValueError):
            raise HTTPException(400, "Invalid order parameter")

    output_path = job_dir / "merged.pdf"

    try:
        merge_pdfs(saved_paths, output_path)
    except Exception as e:
        raise HTTPException(500, f"Failed to merge PDFs: {str(e)}")

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="merged.pdf",
    )
