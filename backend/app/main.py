from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import analyze, results, leaderboard, clips

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MemeFace API")

# 1. ตั้งค่า CORS สำหรับ API Routes ปกติ
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,                    
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 2. 🌟 สร้าง Class พิเศษเพื่อบังคับให้ Static Files พ่น CORS แน่นอน (แก้บั๊กสถานะ 304/404 ลืมพ่น CORS)
class CORSStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.include_router(results.router)
app.include_router(leaderboard.router)
app.include_router(analyze.router)
app.include_router(clips.router)

# 3. 🌟 ดึงรูปภาพมีมผ่าน Supabase Storage แทนแล้ว จึงลบบรรทัด /memes ออก
# ส่วนโฟลเดอร์ /clips ยังคงปล่อยให้เซิร์ฟเวอร์จ่ายแบบ Local ไว้ตามเดิม
app.mount("/clips", CORSStaticFiles(directory="app/clips"), name="clips")