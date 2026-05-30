import random
from pathlib import Path
from urllib.parse import quote

from fastapi import HTTPException

try:
    import cv2
    import mediapipe as mp
    import numpy as np
except ImportError as exc:
    cv2 = None
    mp = None
    np = None
    IMPORT_ERROR = exc
else:
    IMPORT_ERROR = None


MEME_DIR = Path(__file__).resolve().parents[1] / "memes"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# 1. ปรับหมวดหมู่ให้เหลือ 3 อารมณ์ตามโฟลเดอร์ที่คุณสร้างไว้
CATEGORY_LABELS = {
    "neutral": ("NPC Stare", "just existing in the simulation", "Common"),
    "Happiness": ("Main Character", "radiating positive energy", "Rare"),
    "Fear-Surprise": ("Shocked Pikachad", "did not see that plot twist coming", "Epic"),
}

CATEGORY_EXPRESSIONS = {
    "neutral": "blank stare",
    "Happiness": "bright smile",
    "Fear-Surprise": "wide eyes and open mouth",
}

SELECTED_LANDMARKS = {
    "left_eye_outer": 33,
    "left_eye_inner": 133,
    "right_eye_inner": 362,
    "right_eye_outer": 263,
    "mouth_left": 61,
    "mouth_right": 291,
    "mouth_upper": 13,
    "mouth_lower": 14,
    "nose_tip": 1,
    "chin": 152,
}


# 2. ฟังก์ชันเลือกรูปจากโฟลเดอร์ที่ตรงกับชื่อหมวดหมู่อารมณ์ (คืน 3 รูปไม่ซ้ำกัน)
def select_meme_images(category, count=3):
    category_dir = MEME_DIR / category

    if category_dir.exists():
        meme_images = [
            path for path in category_dir.iterdir()
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        ]
        if meme_images:
            # ถ้ามีรูปน้อยกว่า count ให้ sample with replacement (ซ้ำได้)
            if len(meme_images) >= count:
                return random.sample(meme_images, count)
            else:
                return random.choices(meme_images, k=count)

    # กรณีฉุกเฉิน (โฟลเดอร์ว่าง หรือหาไม่เจอ) ให้ดึงรูปอะไรก็ได้ในโฟลเดอร์ memes มาแทน
    all_images = [p for p in MEME_DIR.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS]
    if not all_images:
        return []
    if len(all_images) >= count:
        return random.sample(all_images, count)
    return random.choices(all_images, k=count)


# backward-compat wrapper (ใช้ใน fallback path ด้านล่าง)
def select_meme_image(category):
    results = select_meme_images(category, count=1)
    return results[0] if results else None


def point(landmarks, index):
    landmark = landmarks[index]
    return np.array([landmark.x, landmark.y], dtype=np.float32)


def distance(landmarks, a, b):
    return float(np.linalg.norm(point(landmarks, a) - point(landmarks, b)))


def safe_ratio(value, baseline):
    if baseline <= 0:
        return 0.0
    return float(value / baseline)


def clamp(value, minimum=0, maximum=100):
    return max(minimum, min(maximum, int(round(value))))


def extract_face_features(landmarks):
    xs = [landmark.x for landmark in landmarks]
    ys = [landmark.y for landmark in landmarks]
    face_width = max(xs) - min(xs)
    face_height = max(ys) - min(ys)

    left_eye_width = distance(landmarks, 33, 133)
    right_eye_width = distance(landmarks, 362, 263)
    left_eye_open = safe_ratio(distance(landmarks, 159, 145), left_eye_width)
    right_eye_open = safe_ratio(distance(landmarks, 386, 374), right_eye_width)
    eye_open = (left_eye_open + right_eye_open) / 2

    mouth_width = distance(landmarks, 61, 291)
    mouth_open = safe_ratio(distance(landmarks, 13, 14), mouth_width)
    mouth_center_y = (point(landmarks, 13)[1] + point(landmarks, 14)[1]) / 2
    mouth_corner_y = (point(landmarks, 61)[1] + point(landmarks, 291)[1]) / 2
    smile_curve = safe_ratio(mouth_center_y - mouth_corner_y, face_height)

    left_brow_eye_gap = safe_ratio(distance(landmarks, 65, 159), face_height)
    right_brow_eye_gap = safe_ratio(distance(landmarks, 295, 386), face_height)
    brow_gap = (left_brow_eye_gap + right_brow_eye_gap) / 2

    return {
        "eye_open": eye_open,
        "mouth_open": mouth_open,
        "smile_curve": smile_curve,
        "brow_gap": brow_gap,
        "brow_tilt": abs(point(landmarks, 65)[1] - point(landmarks, 295)[1]),
        "head_tilt": abs(point(landmarks, 234)[1] - point(landmarks, 454)[1]),
        "face_ratio": safe_ratio(face_height, face_width),
    }


def extract_face_box(landmarks):
    xs = [landmark.x for landmark in landmarks]
    ys = [landmark.y for landmark in landmarks]
    return {
        "x": round(min(xs), 4),
        "y": round(min(ys), 4),
        "width": round(max(xs) - min(xs), 4),
        "height": round(max(ys) - min(ys), 4),
    }


def extract_selected_landmarks(landmarks):
    return {
        name: {
            "x": round(landmarks[index].x, 4),
            "y": round(landmarks[index].y, 4),
        }
        for name, index in SELECTED_LANDMARKS.items()
    }


# 3. แก้ไขสูตรประเมินหน้าให้จับ 3 อารมณ์
def classify_meme(features):
    eye_open = features["eye_open"]
    mouth_open = features["mouth_open"]
    smile_curve = features["smile_curve"]
    brow_gap = features["brow_gap"]
    brow_tilt = features["brow_tilt"]
    head_tilt = features["head_tilt"]
    face_ratio = features["face_ratio"]

    scores = {
        "neutral": 60 - abs(smile_curve) * 100 - abs(mouth_open - 0.05) * 50,
        "Happiness": 40 + max(0, smile_curve) * 200 + max(0, eye_open - 0.20) * 50,
        "Fear-Surprise": 40 + max(0, mouth_open - 0.15) * 150 + max(0, eye_open - 0.26) * 150
    }

    category = max(scores, key=scores.get)
    confidence = clamp(scores[category])
    return category, confidence, {name: clamp(score) for name, score in scores.items()}


def rarity_from_confidence(default_rarity, confidence):
    if confidence >= 92:
        return "Legendary"
    if confidence >= 84:
        return "Epic"
    if confidence >= 74:
        return "Rare"
    if confidence >= 64:
        return "Uncommon"
    return default_rarity


def decode_image(image_bytes):
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Image could not be decoded")
    return image


def analyze_face_meme(image_bytes):
    if IMPORT_ERROR:
        raise HTTPException(
            status_code=500,
            detail=f"Face analysis dependencies are missing: {IMPORT_ERROR.name}",
        )

    # เช็คว่ามีรูปในระบบทั้งหมดไหม
    all_images = [p for p in MEME_DIR.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS]
    if not all_images:
        raise HTTPException(status_code=404, detail="No meme images found in any folder")

    image = decode_image(image_bytes)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    face_mesh = mp.solutions.face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=3,
        refine_landmarks=True,
        min_detection_confidence=0.5,
    )

    with face_mesh:
        result = face_mesh.process(rgb_image)

    faces = result.multi_face_landmarks or []

    # กรณีหาหน้าคนไม่เจอ (Fallback เป็น neutral)
    if not faces:
        default_meme = random.choice(all_images)
        relative_path = default_meme.relative_to(MEME_DIR)
        encoded_path = quote(str(relative_path).replace("\\", "/"))
        
        return {
            "creature": "Unknown Beast",
            "category": "neutral",
            "expression": CATEGORY_EXPRESSIONS["neutral"],
            "animal_score": 0,
            "meme_score": 0,
            "confidence": 0,
            "npc_score": 0,
            "aura": 0,
            "braincells": 1,
            "rarity": "Common",
            "animal_vibe": "same chaotic animal frequency",
            "matched_meme_name": default_meme.name,
            "matched_meme_url": f"https://xsxvisvacsgikjwffirg.supabase.co/storage/v1/object/public/memes/{encoded_path}",
            "face_detected": False,
            "face_count": 0,
            "analysis_method": "mediapipe-face-mesh-rules",
            "landmark_count": 0,
            "face_box": None,
            "landmarks": {},
            "features": {},
            "category_scores": {},
        }

    landmarks = faces[0].landmark
    features = extract_face_features(landmarks)
    category, confidence, category_scores = classify_meme(features)
    creature, animal_vibe, default_rarity = CATEGORY_LABELS[category]
    rarity = rarity_from_confidence(default_rarity, confidence)
    
    # 4. เรียก 3 รูปและแปลง URL ให้ต่อโฟลเดอร์อารมณ์ถูกต้อง
    matched_images = select_meme_images(category, count=3)

    def image_to_url(img_path):
        relative_path = img_path.relative_to(MEME_DIR)
        encoded_path = quote(str(relative_path).replace("\\", "/"))
        return f"http://localhost:8002/memes/{encoded_path}"

    matched_meme_urls = [image_to_url(img) for img in matched_images]
    # backward-compat: ยังคง matched_meme_url (รูปแรก) ไว้ให้ client เก่าใช้ได้
    final_meme_url = matched_meme_urls[0] if matched_meme_urls else ""
    matched_image = matched_images[0] if matched_images else None

    aura = clamp(
        50
        + features["head_tilt"] * 220
        + features["smile_curve"] * 260
        + (features["eye_open"] - 0.2) * 120,
        -100,
        100,
    )
    braincells = max(1, min(10, int(round(11 - confidence / 11))))

    return {
        "creature": creature,
        "category": category,
        "expression": CATEGORY_EXPRESSIONS[category],
        "animal_score": confidence,
        "meme_score": confidence,
        "confidence": confidence,
        "npc_score": confidence,
        "aura": aura,
        "braincells": braincells,
        "rarity": rarity,
        "animal_vibe": animal_vibe,
        "matched_meme_name": matched_image.name if matched_image else "Unknown",
        "matched_meme_url": final_meme_url,
        "matched_meme_urls": matched_meme_urls,
        "face_detected": True,
        "face_count": len(faces),
        "analysis_method": "mediapipe-face-mesh-rules",
        "landmark_count": len(landmarks),
        "face_box": extract_face_box(landmarks),
        "landmarks": extract_selected_landmarks(landmarks),
        "features": {name: round(value, 4) for name, value in features.items()},
        "category_scores": category_scores,
    }