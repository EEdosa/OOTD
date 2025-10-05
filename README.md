# 🧥 Open Wardrobe – Real-Time Clothing Detection App

Open Wardrobe is a **Flask + TensorFlow** web application that detects clothing items in real time using your webcam.  
It uses a pretrained CNN model (`.keras`) to classify clothing types and integrates both **Flask** (Python backend) and **Node.js** (optional backend services).

---

## 🚀 Features

- Real-time webcam clothing detection  
- Flask backend for image processing and TensorFlow inference  
- Node.js backend (optional) for authentication and other APIs  
- Text-to-speech feedback using `pyttsx3`  
- Clean and responsive UI with Start/Stop live detection controls  

---

## 🧩 Dependencies

### 🐍 Python Packages
Install with:
```bash
pip install flask flask-cors tensorflow opencv-python numpy pyttsx3
sudo apt-get update
sudo apt-get install -y libgl1 libglib2.0-0
git lfs install

---
Run using
python app.py
npm run dev
