import requests

with open('test.jpg', 'rb') as f:
    data = f.read()

r = requests.post('http://localhost:8001/analyze/', headers={'Content-Type': 'image/jpeg'}, data=data)
print('status:', r.status_code)
print('text:', r.text)