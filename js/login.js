const BASE_URL = "https://mindcare-backend-juwe.onrender.com";

console.log("login.js loaded");
const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    msg.textContent = "Please enter email and password";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "Signing in...";
  msg.style.color = "#2a8cff";


  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then((data) => {
      console.log("LOGIN RESPONSE ", data);

      //  Save full user object
      localStorage.setItem("user", JSON.stringify(data));

      //  Extract userId safely
      const userId = data.userId || data.id || (data.user && data.user.id);

      if (!userId) {
        msg.textContent = "Login failed: userId missing";
        msg.style.color = "red";
        console.error("userId not found in response", data);
        return;
      }

      localStorage.setItem("userId", userId);

      msg.textContent = "Login successful. Checking profile...";
      msg.style.color = "green";

      // STEP 2: CHECK PROFILE EXISTS
      fetch(`${BASE_URL}/api/user/profile/exists/${userId}`)
        .then(res => res.json())
        .then(exists => {

          const profileExists = exists === true;

          console.log("PROFILE EXISTS ?", profileExists);

          if (data.role === "ADMIN") {
            window.location.href = "../pages/admin-dashboard.html";
          } else {
            if (profileExists) {
              window.location.href = "../pages/user-dashboard.html";
            } else {
              window.location.href = "../pages/profilePage.html";
            }
          }
        });

    })
    .catch(() => {
      msg.textContent = "Invalid email or password";
      msg.style.color = "red";
    });
});


