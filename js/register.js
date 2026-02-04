console.log("register.js loaded");

const form = document.getElementById("registerForm");
const msg = document.getElementById("registerMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    msg.textContent = "Please fill all fields";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "Creating your account...";
  msg.style.color = "#2a8cff";

  const BASE_URL = "https://mindcare-backend-juwe.onrender.com";

  fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
    .then((res) => res.text()) // response actual message
    .then((text) => {
      msg.textContent = text;

      if (text.toLowerCase().includes("success")) {
        msg.style.color = "green";
        setTimeout(() => {
          window.location.href = "../pages/login.html";
        }, 1900);
      } else {
        msg.style.color = "red";
      }
    })
    .catch(() => {
      msg.textContent = "Server error";
      msg.style.color = "red";
    });
});
