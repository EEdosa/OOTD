from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import pyttsx3

# --- Initialize Flask app ---
app = Flask(__name__)
CORS(app)

# --- Load your trained .keras model ---
model = load_model("DetectionModel.keras")

# --- Initialize speech engine (for visually impaired users) ---
engine = pyttsx3.init()

def speak(text):
    """Speak text aloud (useful for accessibility)."""
    engine.say(text)
    engine.runAndWait()

# --- TEMPORARY TEST DATABASE (replace with MongoDB later) ---
test_users = {}

# --- ROUTES ---

@app.route("/")
def home():
    """Landing page (sign-in / sign-up)."""
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
    """Handle new user sign-up."""
    data = request.get_json() or request.form
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
    if email in test_users:
        return jsonify({"error": "User already exists"}), 400

    test_users[email] = {"username": username, "password": password}
    print("✅ Created user:", test_users[email])
    return jsonify({"message": "User created successfully", "redirect": "/main"}), 201

@app.route("/signin", methods=["POST"])
def signin():
    """Handle user login."""
    data = request.get_json() or request.form
    email = data.get("email")
    password = data.get("password")

    user = test_users.get(email)
    if user and user["password"] == password:
        return jsonify({"message": "Login successful", "redirect": "/main"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route("/main")
def main():
    """Main page after login (upload & detection)."""
    return render_template("main.html")

# --- CLOTHING DETECTION ROUTE ---
@app.route("/predict", methods=["POST"])
def predict():
    """Handle clothing detection from uploaded image."""
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        # Read and preprocess image
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
        img = cv2.resize(img, (28, 28))  # Adjust this size to your model’s input
        img = np.expand_dims(img, axis=0) / 255.0

        # Predict clothing class
        preds = model.predict(img)
        class_names = ['T-Shirt', 'Pants', 'Pullover', 'Dress', 'Coat', 'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle Boot']       
        predicted_class = class_names[np.argmax(preds)]
        print(predicted_class)
        predictions = model.predict(img)
        probabilities = predictions[0]
        print("Probabilities:", probabilities)

        predicted_index = int(np.argmax(probabilities))
        print("Predicted class index:", predicted_index)
        
        model.summary()

        # Speak prediction for accessibility
        speak(f"You are wearing {predicted_class}")

        return jsonify({"prediction": predicted_class}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
