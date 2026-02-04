document.addEventListener("DOMContentLoaded", () => {

  const chatContainer = document.getElementById("chatContainer");
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userMessage");
  const newChatBtn = document.getElementById("newChatBtn");
  const suggestions = document.querySelectorAll(".suggestions-item");

  /* USER */
  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?.id;

  if (!USER_ID) {
    alert("User not logged in");
    window.location.href = "../pages/login.html";
    return;
  }

  const BASE_URL = "https://mindcare-backend-juwe.onrender.com";


  /* BACKEND URL */
  const SEND_MSG_URL = `${BASE_URL}/api/chat/${USER_ID}`;

  /* ---------------- UI HELPER ---------------- */
  function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  /* ---------------- DEFAULT BOT MESSAGE ---------------- */
  addMessage("Hi, I’m MindCare. How are you feeling today?", "bot");

  /* ---------------- NEW CHAT ---------------- */
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      chatContainer.innerHTML = "";
      addMessage("Hi, I’m MindCare. How are you feeling today?", "bot");
    });
  }

  /* ---------------- SUGGESTION CLICK (Gemini style) ---------------- */
  suggestions.forEach(item => {
    item.addEventListener("click", () => {
      const text = item.innerText.trim();
      userInput.value = text;
      sendMessage(text);
    });
  });

  /* ---------------- FORM SUBMIT ---------------- */
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    sendMessage(message);
  });

  /* ---------------- SEND MESSAGE ---------------- */
  async function sendMessage(message) {
    addMessage(message, "user");
    userInput.value = "";

    try {
      const response = await fetch(SEND_MSG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      addMessage(
        data.botReply || "I’m here with you 💙 Can you tell me a bit more?",
        "bot"
      );

    } catch (err) {
      console.error(err);
      addMessage("Sorry, something went wrong. Please try again.", "bot");
    }
  }

});
