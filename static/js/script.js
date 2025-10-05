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
