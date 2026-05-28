from fastapi import APIRouter
from app.clip_metadata import CLIPS, JUMPSCARE_CLIPS
import random

router = APIRouter(prefix="/api/clips", tags=["clips"])

@router.get("/")
def get_all_clips():
    return CLIPS

@router.get("/random")
def get_random_clip():
    return random.choice(CLIPS)

@router.get("/jumpscare/random")
def get_random_jumpscare():
    return random.choice(JUMPSCARE_CLIPS)