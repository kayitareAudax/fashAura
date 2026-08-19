import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError
from fastapi import HTTPException, status
from starlette.concurrency import run_in_threadpool

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


async def upload_image(file_bytes: bytes, folder: str) -> dict:
    """Upload raw image bytes to Cloudinary. Runs the (blocking) SDK call in a
    threadpool so it doesn't stall the event loop."""
    try:
        result = await run_in_threadpool(
            cloudinary.uploader.upload,
            file_bytes,
            folder=folder,
            resource_type="image",
        )
    except CloudinaryError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Image upload failed: {exc}"
        )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


async def delete_image(public_id: str | None) -> None:
    if not public_id:
        return
    await run_in_threadpool(cloudinary.uploader.destroy, public_id)
