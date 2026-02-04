const assessmentData = {
    STRESS: [
        {
            q: "In the past few days, have you felt unable to cope with daily responsibilities?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Yes, often", value: 5 }
            ]
        },
        {
            q: "How frequently have you felt mentally pressured or overloaded?",
            options: [
                { text: "Never", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Often", value: 5 }
            ]
        },
        {
            q: "How much has stress affected your ability to focus or make decisions?",
            options: [
                { text: "Not at all", value: 1 },
                { text: "A little", value: 3 },
                { text: "A lot", value: 5 }
            ]
        },
        {
            q: "How often have you felt irritated due to daily pressures?",
            options: [
                { text: "Rarely", value: 1 },
                { text: "Occasionally", value: 3 },
                { text: "Frequently", value: 5 }
            ]
        },
        {
            q: "How difficult has it been to manage your workload recently?",
            options: [
                { text: "Easy", value: 1 },
                { text: "Manageable", value: 3 },
                { text: "Difficult", value: 5 }
            ]
        },
        {
            q: "Have you felt emotionally drained at the end of the day?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Yes", value: 5 }
            ]
        }
    ],

    ANXIETY: [
        {
            q: "How often have you felt nervous or anxious without a clear reason?",
            options: [
                { text: "Not at all", value: 1 },
                { text: "Several days", value: 3 },
                { text: "Nearly every day", value: 5 }
            ]
        },
        {
            q: "Do you find it difficult to relax your mind?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Yes", value: 5 }
            ]
        },
        {
            q: "How often do worrying thoughts interrupt your daily activities?",
            options: [
                { text: "Rarely", value: 1 },
                { text: "Occasionally", value: 3 },
                { text: "Often", value: 5 }
            ]
        },
        {
            q: "Have you felt restless or uneasy recently?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Yes", value: 5 }
            ]
        },
        {
            q: "Do anxious thoughts return even after trying to calm yourself?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Very often", value: 5 }
            ]
        },
        {
            q: "Has anxiety affected your confidence or social interactions?",
            options: [
                { text: "Not at all", value: 1 },
                { text: "A little", value: 3 },
                { text: "A lot", value: 5 }
            ]
        }
    ],

    SLEEP: [
        {
            q: "How would you rate your overall sleep quality recently?",
            options: [
                { text: "Good", value: 1 },
                { text: "Average", value: 3 },
                { text: "Poor", value: 5 }
            ]
        },
        {
            q: "Do you struggle to fall asleep at night?",
            options: [
                { text: "No", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Often", value: 5 }
            ]
        },
        {
            q: "How often do you wake up during the night?",
            options: [
                { text: "Rarely", value: 1 },
                { text: "Sometimes", value: 3 },
                { text: "Frequently", value: 5 }
            ]
        },
        {
            q: "How rested do you feel after waking up?",
            options: [
                { text: "Well rested", value: 1 },
                { text: "Somewhat rested", value: 3 },
                { text: "Not rested", value: 5 }
            ]
        },
        {
            q: "Has poor sleep affected your mood or energy during the day?",
            options: [
                { text: "No", value: 1 },
                { text: "A little", value: 3 },
                { text: "A lot", value: 5 }
            ]
        },
        {
            q: "How consistent has your sleep schedule been?",
            options: [
                { text: "Very consistent", value: 1 },
                { text: "Somewhat consistent", value: 3 },
                { text: "Irregular", value: 5 }
            ]
        }
    ]
};

/*  LOGIC */
let currentType = "";

function loadAssessment(type) {
    currentType = type;
    document.getElementById("assessmentTitle").innerText = type + " Assessment";

    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";

    assessmentData[type].forEach((item, index) => {
        let optionsHTML = "";
        item.options.forEach(opt => {
            optionsHTML += `
        <label>
          <input type="radio" name="q${index}" value="${opt.value}" required>
          ${opt.text}
        </label>
      `;
        });

        container.innerHTML += `
      <div class="question">
        <p>${index + 1}. ${item.q}</p>
        ${optionsHTML}
      </div>
    `;
    });

    document.getElementById("assessmentForm").classList.remove("hidden");
    document.getElementById("resultBox").classList.add("hidden");
    document.getElementById("assessmentForm").reset();
}

document.getElementById("assessmentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in");
        return;
    }

    let score = 0;
    assessmentData[currentType].forEach((_, index) => {
        score += Number(document.querySelector(`input[name="q${index}"]:checked`).value);
    });

    const BASE_URL = "https://mindcare-backend-juwe.onrender.com";


    fetch(`${BASE_URL}/api/user/assessment/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            assessmentType: currentType,
            score: score
        })
    })
        .then(res => res.json())
        .then(data => {
            const level = data.data.resultLevel;

            let suggestions = getSuggestions(currentType, level);

            const resultBox = document.getElementById("resultBox");
            resultBox.innerHTML = `
    <strong>Your ${currentType} Level: ${level}</strong><br><br>
    <p>Based on your responses, here are some personalized suggestions to help you manage and improve:</p>
    <ul>${suggestions}</ul>
    <p>Remember, MindCare is here to support you. Consider chatting with our AI assistant for more guidance or tracking your progress over time.</p>
  `;

            resultBox.classList.remove("hidden");

            //  Smooth auto scroll to result
            setTimeout(() => {
                resultBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        });

});

function getSuggestions(type, level) {
    const suggestionsMap = {
        STRESS: {
            LOW: [
                "Continue healthy eating and regular physical activity to keep stress levels low.",
                "Practice short mindfulness or relaxation exercises daily.",
                "Maintain a balanced work-life routine with adequate rest.",
                "Use AI chat occasionally to reflect and stay emotionally aware."
            ],
            MODERATE: [
                "Take short breaks during the day and practice simple breathing exercises.",
                "Maintain a regular routine with proper meals and sleep timings.",
                "Add moderate physical activity like walking or light workouts to your day.",
                "Track your mood and stress patterns to understand what triggers them."
            ],
            HIGH: [
                "Pause and calm your body: try slow breathing (inhale 4 sec, exhale 6 sec) for a few minutes.",
                "Support your body with healthy meals and enough water; avoid excess caffeine or junk food.",
                "Include light physical activity like walking, stretching, or yoga to release built-up tension.",
                "Reduce overload by breaking tasks into small steps and talking to someone you trust or using AI chat support."
            ]

        },
        ANXIETY: {
            LOW: [
                "Maintain healthy daily habits such as regular meals, hydration, and physical activity.",
                "Practice short mindfulness or breathing exercises to stay mentally balanced.",
                "Limit overthinking by focusing on one task at a time.",
                "Use AI chat occasionally to reflect and stay emotionally aware."
            ],
            MODERATE: [
                "Try grounding techniques like focusing on your surroundings to calm anxious thoughts.",
                "Reduce caffeine and screen time, especially in the evening.",
                "Include light exercise such as walking or stretching to relax your body.",
                "Track your mood and anxiety patterns to identify triggers."
            ], HIGH: [
                "Pause and calm your nervous system using slow breathing or grounding exercises.",
                "Eat balanced meals and avoid excess caffeine or sugar that may increase anxiety.",
                "Engage in gentle physical activity like walking, yoga, or stretching to release tension.",
                "Reach out to someone you trust or use AI chat support to avoid feeling alone."
            ]

        },
        SLEEP: {
            LOW: [
                "Keep a consistent sleep and wake-up schedule, even on weekends.",
                "Maintain a calm bedtime routine such as reading or light stretching.",
                "Limit screen exposure before bed to support natural sleep.",
                "Use AI chat to learn more about healthy sleep habits."
            ],
            MODERATE: [
                "Avoid heavy meals, caffeine, or screens close to bedtime.",
                "Try relaxation techniques like deep breathing or listening to calming music before sleep.",
                "Get regular daylight exposure and light exercise during the day.",
                "Track your sleep patterns to understand what affects your rest."
            ],
            HIGH: [
                "Create a strict sleep routine by going to bed and waking up at the same time daily.",
                "Avoid naps and only go to bed when you feel truly sleepy.",
                "Support better sleep with healthy meals and regular daytime activity.",
                "Use relaxation or AI-guided calming tools to help your mind unwind before sleep."
            ]

        }
    };

    return suggestionsMap[type][level].map(s => `<li>${s}</li>`).join('');
}