import os
import time
import asyncio
import shutil
from pathlib import Path

TEMP_DIR = Path(__file__).parent.parent / "temp"
MAX_AGE_SECONDS = 600  # 10 minutes


def ensure_temp_dir():
    """Create the temp directory if it doesn't exist."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)


def create_job_dir() -> Path:
    """Create a unique job directory inside temp/."""
    ensure_temp_dir()
    job_id = f"{int(time.time() * 1000)}_{os.getpid()}"
    job_dir = TEMP_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    return job_dir


def cleanup_old_files():
    """Delete job directories older than MAX_AGE_SECONDS."""
    if not TEMP_DIR.exists():
        return
    now = time.time()
    for item in TEMP_DIR.iterdir():
        if item.is_dir():
            age = now - item.stat().st_mtime
            if age > MAX_AGE_SECONDS:
                shutil.rmtree(item, ignore_errors=True)


async def periodic_cleanup(interval: int = 60):
    """Background task that runs cleanup every `interval` seconds."""
    while True:
        cleanup_old_files()
        await asyncio.sleep(interval)
