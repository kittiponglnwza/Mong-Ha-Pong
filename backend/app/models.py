from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base  # แก้จาก "from database" → "from app.database"
from datetime import datetime
import uuid

class Result(Base):
    __tablename__ = "results"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    creature   = Column(String, nullable=False)
    emoji      = Column(String, nullable=False)
    npc_score  = Column(Integer, nullable=False)
    aura       = Column(Integer, nullable=False)
    braincells = Column(Integer, nullable=False)
    rarity     = Column(String, nullable=False)
    best_match = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)