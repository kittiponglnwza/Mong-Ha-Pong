from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import analyze, results, leaderboard, clips

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MemeFace API")

# --- แก้ไขตรงจุดนี้ใน main.py ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # เจาะจงไปเลยว่าอนุญาตให้พอร์ต Frontend ของเราเข้าถึงได้
    allow_credentials=True,                    # เปลี่ยนจาก False เป็น True
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(results.router)
app.include_router(leaderboard.router)
app.include_router(analyze.router)
app.include_router(clips.router)

app.mount("/memes", StaticFiles(directory="app/memes"), name="memes")
app.mount("/clips", StaticFiles(directory="app/clips"), name="clips")

@app.get("/")
def root():
    return {"status": "ok"}