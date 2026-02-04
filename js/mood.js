const BASE_URL = "https://mindcare-backend-juwe.onrender.com";
// NAVIGATION 
document.getElementById("dashboardBtn").addEventListener("click", () => {
  window.location.href = "../pages/user-dashboard.html";
});

document.getElementById("historyBtn").addEventListener("click", () => {
  window.location.href = "../pages/history.html";
});


// MOOD SELECTION 
const emojiBtns = document.querySelectorAll(".emoji-btn");
const moodCaption = document.getElementById("mood-caption");
const tipsTitle = document.getElementById("tips-title");
const tipsList = document.getElementById("tipsList");
const noteInput = document.getElementById("note");

emojiBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    emojiBtns.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    const mood = btn.dataset.mood;
    moodCaption.textContent = getCaption(mood);

    tipsTitle.innerHTML =
      `Quick Tips for <span id="tipMood">${mood.toUpperCase()}</span> Days`;
    tipsList.innerHTML = getTips(mood);
  });
});

function getCaption(mood) {
  const captions = {
    ecstatic: "Feeling amazing and full of joy!",
    happy: "Smiling and feeling positive.",
    calm: "Peaceful and satisfied.",
    neutral: "Balanced and steady.",
    sad: "Feeling down, but that's okay.",
    anxious: "A bit worried or restless.",
    angry: "Frustrated or upset.",
    stressed: "Feeling under pressure — take it slow."
  };
  return captions[mood] || "Select a mood.";
}

function getTips(mood) {
  const tips = {
    ecstatic: [
      "<li>Celebrate this feeling—share it with a friend!</li>",
      "<li>Use this energy creatively.</li>"
    ],
    happy: [
      "<li>Enjoy the moment and stay present.</li>",
      "<li>Reflect on what made you feel good.</li>"
    ],
    calm: [
      "<li>Enjoy the calm—read or meditate.</li>",
      "<li>Plan something nice for tomorrow.</li>"
    ],
    neutral: [
      "<li>Take a short walk to refresh.</li>",
      "<li>Try deep breathing for 2 minutes.</li>"
    ],
    sad: [
      "<li>Reach out to someone you trust.</li>",
      "<li>Be gentle with yourself today.</li>"
    ],
    anxious: [
      "<li>Ground yourself: name 5 things you see.</li>",
      "<li>Slow breathing can help.</li>"
    ],
    angry: [
      "<li>Pause before reacting.</li>",
      "<li>Write down what you’re feeling.</li>"
    ],
    stressed: [
      "<li>Feeling overwhelmed is okay.</li>",
      "<li>Take a short break and breathe.</li>"
    ]
  };

  return tips[mood]?.join("") ||
    "<li>Take a deep breath and check in with yourself.</li>";
}


// SAVE MOOD 
const saveBtn = document.getElementById("saveMoodBtn");

saveBtn.addEventListener("click", () => {

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) {
    alert("Please login first");
    return;
  }

  // Selected mood
  const selectedBtn = document.querySelector(".emoji-btn.selected");
  if (!selectedBtn) {
    alert("Please select a mood");
    return;
  }

  const mood = selectedBtn.dataset.mood.toUpperCase(); // ENUM
  const note = noteInput.value;

  console.log("Sending mood →", { mood, note });

  saveBtn.disabled = true;
  saveBtn.innerText = "Saving...";

  fetch(`${BASE_URL}/api/user/mood/${user.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mood: mood,
      note: note
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    })
    .then(data => {
      console.log("Saved response:", data);


      const tipsSection = document.getElementById("quickTips");
      const containerSection = document.getElementById("mood-container");

      containerSection.style.display = "none";
      tipsSection.style.display = "block";
      tipsSection.scrollIntoView({ behavior: "smooth" });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to save mood");
    })
    .finally(() => {
      saveBtn.disabled = false;
      saveBtn.innerText = "Save Today’s Mood";
    });
});
