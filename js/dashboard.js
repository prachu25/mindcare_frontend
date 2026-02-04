document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    window.location.href = "../pages/login.html";
    return;
  }

  const user = JSON.parse(userData);

  const userNameSpan = document.getElementById("userName");

  if (userNameSpan) {
    userNameSpan.textContent =
      user.name || user.username || user.fullName || "User";
  }
});

// logout 
function logout() {
  localStorage.clear();     // user + userId sab clear
  window.location.href = "/";  // Vercel-safe redirect
}



const BASE_URL = "https://mindcare-backend-juwe.onrender.com";

// profile username show 
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) return;

  fetch(`${BASE_URL}/api/user/profile/${user.id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("floatingUserName").innerText =
        data.name || user.name;
    });
});


// DASHBOARD WIDGETS GRID
document.addEventListener("DOMContentLoaded", () => {
  loadUserStats();
});

function loadUserStats() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) return;

  fetch(`${BASE_URL}/api/user/${user.id}/status`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    })
    .then(data => {
      updateStatsUI(data);
    })
    .catch(err => {
      console.error("Stats error:", err);
    });
}

function updateStatsUI(data) {
  /* STRESS LEVEL */

  const stressMap = {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 85
  };

  const stressKey = data.stressLevel
    ? data.stressLevel.toUpperCase()
    : "MEDIUM";

  const stressPercent = stressMap[stressKey] || 50;

  document.getElementById("stressValue").innerText =
    stressPercent + "%";
  document.getElementById("stressBar").style.width =
    stressPercent + "%";

  /*  MOOD SCORE  */
  const moodScore = Number(data.moodScore) || 0;
  const moodPercent = Math.min((moodScore / 10) * 100, 100);

  document.getElementById("moodValue").innerText = moodScore;
  document.getElementById("moodBar").style.width =
    moodPercent + "%";

  /* WELL-BEING  */

  const wellbeing = Math.round(
    (moodPercent + (100 - stressPercent)) / 2
  );

  document.getElementById("wellbeingValue").innerText =
    wellbeing + "%";
  document.getElementById("wellbeingBar").style.width =
    wellbeing + "%";

}




// <<<<<----- MODEL TRACKER ---->>>>>

// Nav toggle and profile card toggle
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});
document.getElementById('floatingProfile').addEventListener('click', () => {
  const card = document.getElementById('profileCard');
  card.setAttribute('aria-hidden', card.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
  card.classList.toggle('show');
});


//                                     <<<<<--- Sleep Tracker -->>>>>>>>
function openSleepModal() {
  document.getElementById("sleepModal").style.display = "flex";
}

function closeSleepModal() {
  document.getElementById("sleepModal").style.display = "none";
}

function saveSleep() {
  const user = JSON.parse(localStorage.getItem("user"));
  const sleepHours = document.getElementById("sleepRange").value;

  fetch(`${BASE_URL}/api/user/${user.id}/sleep`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sleepHours })
  })
    .then(() => {
      closeSleepModal();
      updateRecentInsight(sleepHours);
    });
}

function updateRecentInsight(sleepHours) {
  const el = document.getElementById("sleepInsight");

  if (sleepHours < 6) {
    el.innerText = `😴 You slept only ${sleepHours} hours. Try to rest today 💙`;
  } else if (sleepHours <= 8) {
    el.innerText = `😌 You slept ${sleepHours} hours — great job!`;
  } else {
    el.innerText = `🌙 You were well rested. Keep it up!`;
  }
}

//                                           <<<<<<--- Guided Meditation --->>>>>>

let meditationInterval;
let breathingInterval;
let timeLeft = 60; // 2 minutes

function openMeditationModal() {
  document.getElementById("meditationModal").style.display = "flex";
  resetMeditation();
}

function closeMeditationModal() {
  document.getElementById("meditationModal").style.display = "none";
  clearInterval(meditationInterval);
  clearInterval(breathingInterval);
}

function resetMeditation() {
  timeLeft = 60;
  document.getElementById("meditationTimer").innerText = "01:00";
  document.getElementById("breathText").innerText =
    "Click start and follow your breath";
  document.getElementById("breathingCircle").className = "breathing-circle";
}

function startMeditation() {
  document.getElementById("startMeditationBtn").disabled = true;

  startBreathingAnimation();
  startTimer();
}

function startBreathingAnimation() {
  const circle = document.getElementById("breathingCircle");
  const text = document.getElementById("breathText");

  let inhale = true;

  breathingInterval = setInterval(() => {
    if (inhale) {
      circle.classList.add("inhale");
      circle.classList.remove("exhale");
      text.innerText = "Breathe in...";
    } else {
      circle.classList.add("exhale");
      circle.classList.remove("inhale");
      text.innerText = "Breathe out...";
    }
    inhale = !inhale;
  }, 4000);
}

function startTimer() {
  meditationInterval = setInterval(() => {
    timeLeft--;

    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    document.getElementById("meditationTimer").innerText = `${min}:${sec}`;

    if (timeLeft <= 0) {
      finishMeditation();
    }
  }, 1000);
}

function finishMeditation() {
  clearInterval(meditationInterval);
  clearInterval(breathingInterval);

  document.getElementById("breathText").innerText =
    "Great job! You took time for yourself.";
  document.getElementById("breathingCircle").className = "breathing-circle";

  document.getElementById("startMeditationBtn").disabled = false;

  // OPTIONAL: update Recent Insights
  const insight = document.getElementById("meditationInsight");
  if (insight) {
    insight.innerText = " You completed a calming meditation today.";
  }
}

//                                           <<<<<--- Assessment --->>>>> 
function openAssessment() {
  window.location.href = "assessment.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  if (!userId) return;

  fetch(`${BASE_URL}/api/user/assessment/history/${userId}`)
    .then(res => res.json())
    .then(res => {

      if (!res.data || res.data.length === 0) return;

      const latest = res.data[res.data.length - 1];

      const type = latest.assessmentType;   // STRESS / ANXIETY / SLEEP
      const level = latest.resultLevel;     // LOW / MODERATE / HIGH

      document.getElementById("assessmentSummary").innerText =
        `Based on your latest ${type.toLowerCase()} assessment, here are some things you can do right now:`;

      const suggestions = getDashboardSuggestions(type, level);

      const list = document.getElementById("actionList");
      list.innerHTML = suggestions.map(s => `<li>${s}</li>`).join("");
    })
    .catch(err => console.error("Suggestion error:", err));
});


function getDashboardSuggestions(type, level) {

  const map = {
    STRESS: {
      LOW: [
        "Maintain a balanced routine with proper meals and rest.",
        "Continue light physical activity like walking or stretching.",
        "Take short mindful breaks during the day."
      ],
      MODERATE: [
        "Pause for a 1-minute breathing exercise.",
        "Reduce task overload by prioritizing important work.",
        "Include light exercise to release tension."
      ],
      HIGH: [
        "Stop and calm your body using slow breathing for a few minutes.",
        "Eat healthy meals and avoid excess caffeine today.",
        "Break tasks into small steps and seek support if needed."
      ]
    },

    ANXIETY: {
      LOW: [
        "Practice mindfulness to stay emotionally balanced.",
        "Limit overthinking by focusing on one task at a time.",
        "Stay connected with supportive people."
      ],
      MODERATE: [
        "Use grounding techniques to calm anxious thoughts.",
        "Reduce caffeine and screen time.",
        "Go for a short walk or stretch."
      ],
      HIGH: [
        "Pause and use grounding or breathing exercises immediately.",
        "Eat balanced meals and stay hydrated.",
        "Reach out to someone you trust or use AI chat support."
      ]
    },

    SLEEP: {
      LOW: [
        "Keep a consistent sleep and wake-up schedule.",
        "Maintain a calming bedtime routine.",
        "Avoid screens close to bedtime."
      ],
      MODERATE: [
        "Reduce caffeine and heavy meals at night.",
        "Try relaxation techniques before sleep.",
        "Get daylight exposure during the day."
      ],
      HIGH: [
        "Fix your sleep timing and avoid late naps.",
        "Engage in daytime physical activity.",
        "Use calming tools or guided relaxation before bed."
      ]
    }
  };

  return map[type]?.[level] || [];
}



//                                             <<<-- CLAM SOUND --->>>
let currentAudio = null;

document.querySelectorAll('.sound-btn').forEach(button => {
  button.addEventListener('click', () => {
    const soundId = button.dataset.sound;
    const audio = document.getElementById(soundId);

    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (audio.paused) {
      audio.play();
      currentAudio = audio;
    } else {
      audio.pause();
    }
  });
});






