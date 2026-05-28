import json
import numpy as np
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from app.services.face_meme_analyzer import analyze_face_meme

router = APIRouter(prefix="/analyze", tags=["analyze"])

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.float32, np.float64)):
            return float(obj)
        if isinstance(obj, (np.int32, np.int64, np.integer)):
            return int(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

@router.post("/")
async def analyze_image(image: bytes = Body(..., media_type="image/jpeg")):
    if not image:
        raise HTTPException(status_code=400, detail="Image is required")
    result = analyze_face_meme(image)
    return JSONResponse(content=json.loads(json.dumps(result, cls=NumpyEncoder)))
