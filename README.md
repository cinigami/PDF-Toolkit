# PDF Toolkit

A full-stack web application for converting, splitting, and merging PDF files.

![PDF Toolkit Screenshot](screenshots/placeholder.png)

## Features

- **Convert to PDF** — Upload documents (.docx, .xlsx, .csv, .pptx), images (.png, .jpg, .bmp, .tiff), or text files (.txt, .md, .html) and convert them to PDF. Download individually or as a ZIP.
- **Split PDF** — Split a PDF into individual pages, extract specific pages, or extract a page range.
- **Merge PDFs** — Upload multiple PDFs, drag to reorder, and merge into a single file.

## Tech Stack

| Layer    | Technology                                           |
|----------|------------------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS v4, Axios, Lucide Icons |
| Backend  | Python, FastAPI, Uvicorn                             |
| PDF      | pypdf, reportlab, Pillow, python-docx, openpyxl, python-pptx, markdown |

## Installation

### Prerequisites

- Node.js 18+
- Python 3.9+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Running Locally

Start both servers:

**Backend** (port 8000):
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Frontend** (port 3000):
```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser. The frontend proxies API requests to the backend automatically.

## API Documentation

### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

### Convert Files to PDF
```
POST /api/convert
Content-Type: multipart/form-data
Body: files (one or more files)
Response: PDF file or ZIP of PDFs
```

### Get PDF Info
```
POST /api/split/info
Content-Type: multipart/form-data
Body: file (single PDF)
Response: { "page_count": 10, "metadata": { ... } }
```

### Split PDF
```
POST /api/split
Content-Type: multipart/form-data
Body: file, mode ("all"|"specific"|"range"), pages, start, end
Response: PDF file or ZIP of PDFs
```

### Merge PDFs
```
POST /api/merge
Content-Type: multipart/form-data
Body: files (two or more PDFs), order (comma-separated indices)
Response: Single merged PDF
```

## Project Structure

```
pdf-toolkit/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ConvertTab.jsx
│   │   │   ├── SplitTab.jsx
│   │   │   ├── MergeTab.jsx
│   │   │   ├── FileDropZone.jsx
│   │   │   ├── FileList.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Toast.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── convert.py
│   │   ├── split.py
│   │   └── merge.py
│   ├── services/
│   │   ├── converter.py
│   │   ├── splitter.py
│   │   └── merger.py
│   ├── utils/
│   │   └── file_cleanup.py
│   └── requirements.txt
├── README.md
└── docker-compose.yml
```

## Configuration

| Setting             | Value         | Location                     |
|---------------------|---------------|------------------------------|
| Max file size       | 50 MB         | Backend routers              |
| Temp file cleanup   | 10 minutes    | `utils/file_cleanup.py`      |
| Frontend port       | 3000          | `vite.config.js`             |
| Backend port        | 8000          | uvicorn startup              |

## Future Improvements

- PDF page thumbnail previews
- Password-protected PDF support
- PDF compression / optimization
- OCR text extraction from scanned PDFs
- Batch watermarking
- Cloud storage integration (S3, Google Drive)
- User accounts and file history
- Docker deployment with nginx reverse proxy
