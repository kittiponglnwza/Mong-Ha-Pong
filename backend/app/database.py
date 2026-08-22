from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # เก็บ Connection เตรียมพร้อมไว้ 10 ตัว ไม่ต้องสร้างใหม่บ่อยๆ
    max_overflow=20,       # ถ้า 10 ตัวไม่พอ สร้างเพิ่มได้อีก 20
    pool_pre_ping=True,    # ⚡ เช็คก่อนว่า Connection ยังรอดไหมก่อนใช้งาน (แก้ปัญหา DB ช้าเพราะ connection ตาย)
    pool_recycle=300       # รีเซ็ต Connection ทุกๆ 5 นาที กัน Supabase ตัด
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()