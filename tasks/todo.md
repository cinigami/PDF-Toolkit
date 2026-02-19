# PDF Toolkit — Build Plan

## Phase 1: Project Scaffolding
- [x] Create project directory structure (`frontend/`, `backend/`)
- [x] Initialize React frontend with Vite + Tailwind CSS
- [x] Initialize Python backend with FastAPI + requirements.txt
- [x] Set up CORS, temp file directory, and basic FastAPI config

## Phase 2: Backend — Core Services
- [x] `backend/utils/file_cleanup.py` — Temp file manager with 10-min auto-delete
- [x] `backend/services/converter.py` — File-to-PDF conversion logic (docx, xlsx, csv, pptx, images, txt, md, html)
- [x] `backend/services/splitter.py` — PDF split logic (individual pages, specific pages, page range)
- [x] `backend/services/merger.py` — PDF merge logic (combine multiple PDFs in order)

## Phase 3: Backend — API Routes
- [x] `backend/main.py` — FastAPI app entry, CORS, startup/shutdown, health check
- [x] `backend/routers/convert.py` — POST /api/convert endpoint
- [x] `backend/routers/split.py` — POST /api/split endpoint (+ POST page count/info)
- [x] `backend/routers/merge.py` — POST /api/merge endpoint

## Phase 4: Frontend — Shared Components
- [x] `Header.jsx` — App title, dark/light mode toggle, tab navigation
- [x] `FileDropZone.jsx` — Drag-and-drop upload zone with visual feedback
- [x] `FileList.jsx` — Uploaded file list with remove/reorder
- [x] `Toast.jsx` — Toast notification system (success/error)
- [x] `index.css` + Tailwind config — Blue/slate palette, dark mode, responsive

## Phase 5: Frontend — Feature Tabs
- [x] `ConvertTab.jsx` — File upload, type validation, convert + download individual/ZIP
- [x] `SplitTab.jsx` — PDF upload, page count display, split options UI, download
- [x] `MergeTab.jsx` — Multi-PDF upload, drag-to-reorder, merge + download
- [x] `App.jsx` — Tab routing, theme state, toast state, layout

## Phase 6: Polish & Docs
- [x] Error handling: file type validation (FE+BE), max 50MB, corrupted file handling
- [x] Progress indicators during processing
- [x] Mobile responsive (Tailwind responsive utilities built-in)
- [x] `README.md` — Description, install steps, API docs, tech stack
- [x] `docker-compose.yml` — Optional Docker setup

---

## Review

### What was built
A complete full-stack PDF Toolkit with React frontend and Python FastAPI backend.

### Backend (7 files)
- **main.py** — FastAPI app with CORS, lifespan-based cleanup task, health endpoint
- **routers/convert.py** — Accepts multi-file upload, converts each to PDF, returns single PDF or ZIP
- **routers/split.py** — Accepts PDF + split mode (all/specific/range), returns split files or ZIP
- **routers/merge.py** — Accepts multiple PDFs + optional order, returns merged PDF
- **services/converter.py** — Conversion logic for 15 file types using reportlab, python-docx, openpyxl, python-pptx, Pillow, markdown
- **services/splitter.py** — PDF splitting using pypdf (individual pages, specific pages, page range)
- **services/merger.py** — PDF merging using pypdf
- **utils/file_cleanup.py** — Temp directory management with 10-minute auto-cleanup

### Frontend (8 files)
- **App.jsx** — Tab routing, dark mode state (persisted to localStorage), toast management
- **Header.jsx** — Logo, tab navigation, dark/light mode toggle
- **FileDropZone.jsx** — Drag-and-drop file upload with visual feedback
- **FileList.jsx** — File listing with size display and remove buttons
- **ConvertTab.jsx** — Multi-file convert with download (individual PDF or ZIP)
- **SplitTab.jsx** — PDF upload, page count display, 3 split modes, download
- **MergeTab.jsx** — Multi-PDF upload with drag-to-reorder (using @hello-pangea/dnd), merge + download
- **Toast.jsx** — Auto-dismissing toast notifications (success/error)

### Key decisions
- Used `@hello-pangea/dnd` instead of `react-beautiful-dnd` (React 19 compatibility)
- Used Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Used CSS custom properties for dark mode colors (works with Tailwind v4)
- Vite dev server proxies `/api` to backend at port 8000
- Reportlab used for all PDF generation (no external tool dependencies like wkhtmltopdf)
- Backend cleanup runs as an async background task every 60 seconds
