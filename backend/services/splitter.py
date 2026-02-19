from pathlib import Path
from pypdf import PdfReader, PdfWriter


def get_pdf_info(input_path: Path) -> dict:
    """Get page count and basic info about a PDF."""
    reader = PdfReader(str(input_path))
    return {
        "page_count": len(reader.pages),
        "metadata": {
            "title": reader.metadata.title if reader.metadata else None,
            "author": reader.metadata.author if reader.metadata else None,
        },
    }


def split_all_pages(input_path: Path, output_dir: Path) -> list[Path]:
    """Split PDF into individual pages. Returns list of output paths."""
    reader = PdfReader(str(input_path))
    output_files = []

    for i, page in enumerate(reader.pages, 1):
        writer = PdfWriter()
        writer.add_page(page)
        out_path = output_dir / f"page_{i}.pdf"
        with open(out_path, "wb") as f:
            writer.write(f)
        output_files.append(out_path)

    return output_files


def split_specific_pages(input_path: Path, output_dir: Path, pages: list[int]) -> list[Path]:
    """Extract specific pages (1-indexed). Returns list of output paths."""
    reader = PdfReader(str(input_path))
    total = len(reader.pages)
    output_files = []

    for page_num in pages:
        if page_num < 1 or page_num > total:
            raise ValueError(f"Page {page_num} out of range (1-{total})")

        writer = PdfWriter()
        writer.add_page(reader.pages[page_num - 1])
        out_path = output_dir / f"page_{page_num}.pdf"
        with open(out_path, "wb") as f:
            writer.write(f)
        output_files.append(out_path)

    return output_files


def split_page_range(input_path: Path, output_dir: Path, start: int, end: int) -> Path:
    """Extract a range of pages (1-indexed, inclusive). Returns single output path."""
    reader = PdfReader(str(input_path))
    total = len(reader.pages)

    if start < 1 or end > total or start > end:
        raise ValueError(f"Invalid range {start}-{end} for PDF with {total} pages")

    writer = PdfWriter()
    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    out_path = output_dir / f"pages_{start}-{end}.pdf"
    with open(out_path, "wb") as f:
        writer.write(f)

    return out_path
