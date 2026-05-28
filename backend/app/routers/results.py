from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/results", tags=["results"])

@router.post("/", response_model=schemas.ResultResponse)
def create_result(payload: schemas.ResultCreate, db: Session = Depends(get_db)):
    result = models.Result(**payload.model_dump())
    db.add(result)
    db.commit()
    db.refresh(result)
    return result