document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("historyContainer");
  container.innerText = "⏳ Loading your mood history...";

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    container.innerText = "User not logged in";
    return;
  }

  const BASE_URL = "https://mindcare-backend-juwe.onrender.com";


  fetch(`${BASE_URL}/api/user/history/mood/${user.id}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    })
    .then(data => {
      if (data.message) {
        container.innerText = data.message;
        return;
      }

      drawMoodChart(data);   // graph
      renderHistory(data);   // cards
    })
    .catch(err => {
      console.error(err);
      container.innerText = "Failed to load mood history";
    });
});

/* MOOD CHART */
function drawMoodChart(data) {

  const labels = data.map(item =>
    new Date(item.date).toLocaleDateString()
  );

  const scores = data.map(item => item.score);

  const ctx = document.getElementById("moodChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Mood Score",
        data: scores,
        fill: true,
        tension: 0.4,
        borderColor: "#0f9d58",
        backgroundColor: "rgba(15,157,88,0.2)",
        pointRadius: 6,
        pointBackgroundColor: scores.map(s =>
          s >= 7 ? "#0f9d58" : s >= 4 ? "#f4b400" : "#db4437"
        )
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

/*  HISTORY CARDS */
function renderHistory(data) {

  const container = document.getElementById("historyContainer");
  container.innerHTML = "";

  data.slice().reverse().forEach(item => {
    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <strong>${item.date}</strong>
      <span>Mood: <b>${item.mood}</b></span>
      <span>Score: ${item.score}</span>
      <span>Note: ${item.note ?? "—"}</span>
    `;

    container.appendChild(card);
  });
}

/* BACK BUTTON*/
function goBack() {
  window.location.href = "../pages/mood.html";
}
