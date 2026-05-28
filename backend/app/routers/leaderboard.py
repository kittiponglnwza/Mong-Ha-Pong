from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from typing import List

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    results = (
        db.query(models.Result)
        .order_by(models.Result.aura.desc())
        .limit(limit)
        .all()
    )
    return [
        schemas.LeaderboardEntry(
            rank       = i + 1,
            creature   = r.creature,
            emoji      = r.emoji,
            aura       = r.aura,
            npc_score  = r.npc_score,
            rarity     = r.rarity,
            created_at = r.created_at,
        )
        for i, r in enumerate(results)
    ]