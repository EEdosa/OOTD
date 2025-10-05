const signupbttn = document.getElementById("signupbttn");
const signupPopup = document.getElementById("signupPopup");
const closePopUp = document.getElementById("closePopUp");
const loginbttn = document.getElementById("loginbttn");
const loginPopUp = document.getElementById("loginPopup");
const closeloginPopUp = document.getElementById("closeloginPopUp");



signupbttn.addEventListener("click", () => {
    signupPopup.classList.remove("hidden");
});

closePopUp.addEventListener("click", () => {
    signupPopup.classList.add("hidden");
});
loginbttn.addEventListener("click", () => {
    loginPopup.classList.remove("hidden");
});

closeloginPopUp.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
});
closeloginPopUp.addEventListener("click", () => {
    loginPopup.classList.add("hidden");
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = signupForm.querySelector('input[placeholder="Username"]').value;
  const email = signupForm.querySelector('input[placeholder="Email"]').value;
  const password = signupForm.querySelector('input[placeholder="Password"]').value;

  //  password length check
  if (password.length < 8) {
    alert("❌ Password must be at least 8 characters long.");
    return; // stop submission
  }

  
  const response = await fetch("http://127.0.0.1:5000/signup", {
    method: "POST", // in app.py, tells app.py how to recive the message
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  });

  const result = await response.json();

  if (response.ok) {
    alert("🎉 Account created successfully!");
    signupForm.reset();
  } else {
    alert("❌ " + result.error);
  }
});

const uploadInput = document.getElementById("uploadInput");
uploadInput.addEventListener("change", function() {
  const fileName = this.files[0]?.name || "No file chosen";
  alert(`Selected: ${fileName}`);
});

    // ---------------- IMAGE UPLOAD DETECTION ----------------
    document.getElementById("uploadBtn").addEventListener("click", async () => {
      const fileInput = document.getElementById("uploadInput");
      const detectedItems = document.getElementById("detectedItems");

      if (!fileInput.files.length) {
        alert("Please select an image first.");
        return;
      }

      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);

      detectedItems.textContent = "🔍 Detecting outfit...";

      try {
        const res = await fetch("/predict", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.prediction) {
          detectedItems.innerHTML = `
            <strong>👕 Detected:</strong> ${data.prediction}<br>
            <em>Try pairing it with matching accessories or layers!</em>
          `;
        } else if (data.error) {
          detectedItems.textContent = "⚠️ Error: " + data.error;
        } else {
          detectedItems.textContent = "No detection result received.";
        }
      } catch (err) {
        detectedItems.textContent = "❌ Error connecting to server.";
        console.error(err);
      }
    });

    // make label open the file chooser
    document.querySelector('.custom-file-upload').addEventListener('click', () => {
      document.getElementById('uploadInput').click();
    });

    // ---------------- LIVE DETECTION (start/stop working properly) ----------------
    const startBtn = document.getElementById('startLiveBtn');
    const stopBtn = document.getElementById('stopLiveBtn');
    const liveImg = document.getElementById('liveFeed');

    startBtn.addEventListener('click', () => {
      // If it's already streaming do nothing
      if (liveImg.src && liveImg.src.includes('/video_feed')) return;

      // Show the image element and open a single persistent MJPEG stream
      liveImg.style.display = 'block';
      liveImg.src = `/video_feed?rand=${Date.now()}`; // single connection to MJPEG stream

      // update button states
      startBtn.disabled = true;
      stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', () => {
      // Close the stream by clearing the src attribute
      try {
        liveImg.src = '';
        liveImg.removeAttribute('src'); // ensure the browser closes the connection
      } catch (e) {
        console.warn('Error while stopping stream:', e);
      }

      // hide the element if you want
      liveImg.style.display = 'none';

      // update button states
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });

    // Optional: if user navigates away, ensure stream is stopped
    window.addEventListener('beforeunload', () => {
      try { liveImg.src = ''; liveImg.removeAttribute('src'); } catch(e){}
    });
