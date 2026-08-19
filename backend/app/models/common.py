from typing import Annotated

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pydantic import BeforeValidator

# Lets a Pydantic model accept a Mongo ObjectId (as stored) and serialize it as a
# plain string in API responses, without pulling bson types into the schema layer.
PyObjectId = Annotated[str, BeforeValidator(str)]


def to_object_id(id_str: str) -> ObjectId:
    """Parse a path/body id into a bson ObjectId, or raise a clean 400."""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid id: {id_str!r}"
        )
