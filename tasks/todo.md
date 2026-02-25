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
- [x] `README.md` — Description, install steps, API docs, tech stack
- [x] `docker-compose.yml` — Optional Docker setup

---

## Phase 7: Mobile Responsiveness

### Issues Found
- Header: logo + tabs + toggle crammed in one row — breaks on phones
- FileDropZone: `p-10` padding excessive on small screens
- Main content: `py-8` wastes vertical space on mobile
- Toast: fixed `min-w-[300px]` at `right-4` overflows narrow screens
- No responsive breakpoints (`sm:`, `md:`) used anywhere

### Checklist
- [x] **Header.jsx** — Stack logo above nav on small screens, reduce tab padding
- [x] **App.jsx** — Reduce main area padding on mobile (`py-4 sm:py-8`)
- [x] **FileDropZone.jsx** — Reduce padding (`p-6 sm:p-10`), smaller icon on mobile
- [x] **Toast.jsx** — Full-width toasts on mobile, position at top-center
- [x] **FileList.jsx** — Reduce padding on mobile for file items
- [x] **MergeTab.jsx** — Reduce file item padding on mobile
- [x] **SplitTab.jsx** — Minor spacing tweaks for small screens

## Review — Mobile Responsiveness

### What changed
All changes use Tailwind `sm:` breakpoint (640px). Desktop appearance is unchanged.

- **Header.jsx** — Layout switches to `flex-col` on mobile: logo + dark mode toggle on top row, tab nav centered below. Dark mode button is duplicated (one for mobile, one for desktop via `sm:hidden`/`hidden sm:block`). Tab button padding reduced on mobile (`px-3 sm:px-4`).
- **App.jsx** — Main content padding: `px-3 sm:px-4 py-4 sm:py-8` (tighter on mobile).
- **FileDropZone.jsx** — Drop zone padding: `p-6 sm:p-10`. Upload icon: 32px on mobile, 40px on desktop. Label text: `text-base sm:text-lg`.
- **Toast.jsx** — Toasts span full width on mobile (`left-3 right-3`), pinned to right on desktop. Removed `min-w`/`max-w` constraints on mobile.
- **FileList.jsx** — File items: `gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3`.
- **MergeTab.jsx** — Same padding reduction as FileList for drag-drop items.
- **SplitTab.jsx** — File info bar: same padding reduction pattern.
