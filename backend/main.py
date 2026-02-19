import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import convert, split, merge
from utils.file_cleanup import periodic_cleanup, ensure_temp_dir


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    ensure_temp_dir()
    cleanup_task = asyncio.create_task(periodic_cleanup())
    yield
    cleanup_task.cancel()


app = FastAPI(
    title="PDF Toolkit API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(convert.router)
app.include_router(split.router)
app.include_router(merge.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
