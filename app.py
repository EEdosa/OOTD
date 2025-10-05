from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from tensorflow.keras.models import load_model
import cv2
import numpy as np

# --- Initialize Flask app ---
app = Flask(__name__)
CORS(app)

# --- Load your trained .keras model ---
model = load_model("final.keras")
class_names = ['pants','shirt','shoes']

# --- TEMPORARY TEST DATABASE ---
test_users = {}

# --- ROUTES ---

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
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
    return render_template("main.html")

# --- IMAGE UPLOAD DETECTION ---
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        img = cv2.resize(img, (224, 224))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)

        preds = model.predict(img)
        predicted_class = class_names[np.argmax(preds)]
        probabilities = preds[0]
        predicted_index = int(np.argmax(probabilities))

        return jsonify({"prediction": predicted_class, "probabilities": probabilities.tolist()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- REAL-TIME WEBCAM DETECTION ---
camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break

        img = cv2.resize(frame, (224, 224))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)

        preds = model.predict(img)
        label = class_names[np.argmax(preds)]
        confidence = np.max(preds)
        # Text to display
        text = f"{label} {confidence:.2f}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.2
        thickness = 3

        # Get the text size
        (text_width, text_height), _ = cv2.getTextSize(text, font, font_scale, thickness)

        # Position in the top-center
        x = (frame.shape[1] - text_width) // 2  # center horizontally
        y = 30 + text_height                      # 30 px from top edge

        # Optional: draw a background rectangle for readability
        cv2.rectangle(frame, (x - 5, y - text_height - 5), (x + text_width + 5, y + 5), (0, 0, 0), -1)

        # Draw the text
        cv2.putText(frame, text, (x, y), font, font_scale, (0, 255, 0), thickness, cv2.LINE_AA)



        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# --- Release camera on exit ---
import atexit
@atexit.register
def cleanup():
    camera.release()
    cv2.destroyAllWindows()



if __name__ == "__main__":
    app.run(debug=True)
