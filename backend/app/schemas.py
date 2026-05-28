from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class ResultCreate(BaseModel):
    creature:   str
    emoji:      str
    npc_score:  int
    aura:       int
    braincells: int
    rarity:     str
    best_match: int

class ResultResponse(BaseModel):
    id:         UUID
    creature:   str
    emoji:      str
    npc_score:  int
    aura:       int
    braincells: int
    rarity:     str
    best_match: int
    created_at: datetime

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank:       int
    creature:   str
    emoji:      str
    aura:       int
    npc_score:  int
    rarity:     str
    created_at: datetime