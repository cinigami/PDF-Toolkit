from pathlib import Path
from pypdf import PdfReader, PdfWriter


def merge_pdfs(input_paths: list[Path], output_path: Path) -> Path:
    """Merge multiple PDFs in order into a single PDF."""
    writer = PdfWriter()

    for pdf_path in input_paths:
        reader = PdfReader(str(pdf_path))
        for page in reader.pages:
            writer.add_page(page)

    with open(output_path, "wb") as f:
        writer.write(f)

    return output_path
