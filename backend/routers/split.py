import zipfile
import json
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from services.splitter import get_pdf_info, split_all_pages, split_specific_pages, split_page_range
from utils.file_cleanup import create_job_dir

router = APIRouter(prefix="/api", tags=["split"])

MAX_FILE_SIZE = 50 * 1024 * 1024


@router.post("/split/info")
async def pdf_info(file: UploadFile = File(...)):
    """Get page count and metadata for a PDF."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large (max 50MB)")

    job_dir = create_job_dir()
    input_path = job_dir / file.filename
    input_path.write_bytes(content)

    try:
        info = get_pdf_info(input_path)
        return info
    except Exception as e:
        raise HTTPException(500, f"Failed to read PDF: {str(e)}")


@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    mode: str = Form(...),          # "all", "specific", "range"
    pages: str = Form(default=""),  # comma-separated page numbers for "specific"
    start: int = Form(default=1),   # start page for "range"
    end: int = Form(default=1),     # end page for "range"
):
    """Split a PDF according to the specified mode."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large (max 50MB)")

    job_dir = create_job_dir()
    output_dir = job_dir / "output"
    output_dir.mkdir()

    input_path = job_dir / file.filename
    input_path.write_bytes(content)

    try:
        if mode == "all":
            result_files = split_all_pages(input_path, output_dir)
        elif mode == "specific":
            page_list = [int(p.strip()) for p in pages.split(",") if p.strip()]
            if not page_list:
                raise HTTPException(400, "No pages specified")
            result_files = split_specific_pages(input_path, output_dir, page_list)
        elif mode == "range":
            result_path = split_page_range(input_path, output_dir, start, end)
            return FileResponse(
                result_path,
                media_type="application/pdf",
                filename=result_path.name,
            )
        else:
            raise HTTPException(400, f"Invalid mode: {mode}")

    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Failed to split PDF: {str(e)}")

    # Single result — return directly
    if len(result_files) == 1:
        return FileResponse(
            result_files[0],
            media_type="application/pdf",
            filename=result_files[0].name,
        )

    # Multiple results — ZIP
    zip_path = job_dir / "split.zip"
    with zipfile.ZipFile(zip_path, "w") as zf:
        for pdf in result_files:
            zf.write(pdf, pdf.name)

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename="split.zip",
    )
