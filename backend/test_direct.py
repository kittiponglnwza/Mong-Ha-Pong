from app.services.face_meme_analyzer import analyze_face_meme

with open('test.jpg', 'rb') as f:
    data = f.read()

try:
    result = analyze_face_meme(data)
    print(result)
except Exception as e:
    import traceback
    traceback.print_exc()