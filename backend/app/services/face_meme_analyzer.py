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

CATEGORY_LABELS = {
    "npc": ("NPC Stare", "blank lobby energy", "Common"),
    "tired": ("Tired Mode", "running on low battery and vibes", "Uncommon"),
    "sleepy": ("Sleepy Spirit", "half awake, fully mysterious", "Uncommon"),
    "sigma": ("Sigma Face", "quiet confidence with side quest aura", "Rare"),
    "awkward": ("Awkward Mode", "smiling through the loading screen", "Common"),
    "angry": ("Angry Meme", "tiny rage, cinematic intensity", "Rare"),
    "sad": ("Sad Sidequest", "rain cloud with decent posture", "Uncommon"),
    "hero": ("Hero Pose", "chosen-one lighting found you", "Epic"),
    "main-character": ("Main Character", "camera-ready plot armor", "Legendary"),
}

CATEGORY_EXPRESSIONS = {
    "npc": "neutral stare",
    "tired": "low eye openness",
    "sleepy": "sleepy eyes",
    "sigma": "tilted confident stare",
    "awkward": "open mouth or tense smile",
    "angry": "low brow pressure",
    "sad": "downturned mouth curve",
    "hero": "wide eyes and upright face",
    "main-character": "bright eyes and camera smile",
}

CATEGORY_IMAGE_HINTS = {
    "npc": ["#meme", "download", "ดาวน์โหลด"],
    "tired": ["monkey", "thinking"],
    "sleepy": ["monkey", "thinking"],
    "sigma": ["doge", "dogesh", "dog"],
    "awkward": ["🙈", "meme"],
    "angry": ["doge", "dogesh", "dog"],
    "sad": ["🙈", "meme"],
    "hero": ["butterfly", "life", "kpop"],
    "main-character": ["butterfly", "life", "kpop"],
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


def list_meme_images():
    if not MEME_DIR.exists():
        return []
    return sorted(
        path
        for path in MEME_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def select_meme_image(category, meme_images):
    hints = CATEGORY_IMAGE_HINTS.get(category, [])
    for hint in hints:
        for image_path in meme_images:
            if hint.lower() in image_path.stem.lower():
                return image_path
    index = list(CATEGORY_LABELS).index(category) % len(meme_images)
    return meme_images[index]


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


def classify_meme(features):
    eye_open = features["eye_open"]
    mouth_open = features["mouth_open"]
    smile_curve = features["smile_curve"]
    brow_gap = features["brow_gap"]
    brow_tilt = features["brow_tilt"]
    head_tilt = features["head_tilt"]
    face_ratio = features["face_ratio"]

    scores = {
        "npc": 55 + (1 - abs(eye_open - 0.23)) * 12 - abs(mouth_open - 0.08) * 80,
        "tired": 45 + max(0, 0.22 - eye_open) * 130 + max(0, 0.08 - brow_gap) * 80,
        "sleepy": 50 + max(0, 0.19 - eye_open) * 180 + max(0, 0.05 - mouth_open) * 80,
        "sigma": 48 + head_tilt * 180 + max(0, 0.18 - mouth_open) * 40 + brow_tilt * 120,
        "awkward": 50 + max(0, mouth_open - 0.14) * 95 + max(0, smile_curve) * 180,
        "angry": 46 + max(0, 0.085 - brow_gap) * 210 + max(0, 0.16 - eye_open) * 70,
        "sad": 48 + max(0, -smile_curve) * 230 + max(0, 0.22 - eye_open) * 50,
        "hero": 44 + max(0, eye_open - 0.26) * 150 + max(0, face_ratio - 1.35) * 30,
        "main-character": 52 + max(0, eye_open - 0.24) * 100 + max(0, smile_curve) * 120,
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

    meme_images = list_meme_images()
    if not meme_images:
        raise HTTPException(status_code=404, detail="No meme images found")

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

    # ไม่เจอหน้า → return default แทน throw error
    if not faces:
        default_meme = meme_images[0]
        encoded_name = quote(default_meme.name)
        return {
            "creature": "Unknown Beast",
            "category": "npc",
            "expression": CATEGORY_EXPRESSIONS["npc"],
            "animal_score": 0,
            "meme_score": 0,
            "confidence": 0,
            "npc_score": 0,
            "aura": 0,
            "braincells": 1,
            "rarity": "Common",
            "animal_vibe": "same chaotic animal frequency",
            "matched_meme_name": default_meme.name,
            "matched_meme_url": f"http://localhost:8002/memes/{encoded_name}",
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
    matched_image = select_meme_image(category, meme_images)
    encoded_name = quote(matched_image.name)

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
        "matched_meme_name": matched_image.name,
        "matched_meme_url": f"http://localhost:8002/memes/{encoded_name}",  # แก้ port 8000 → 8001
        "face_detected": True,
        "face_count": len(faces),
        "analysis_method": "mediapipe-face-mesh-rules",
        "landmark_count": len(landmarks),
        "face_box": extract_face_box(landmarks),
        "landmarks": extract_selected_landmarks(landmarks),
        "features": {name: round(value, 4) for name, value in features.items()},
        "category_scores": category_scores,
    }