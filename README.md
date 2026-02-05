# 🧠 MindCare – Frontend

Frontend for the MindCare mental health web application that provides a clean, calming, and user-friendly interface to support emotional wellbeing.

**Tech:**  • HTML  • CSS  • JavaScript  

**Live:** https://mindcare-health.vercel.app/  
> ⚠️ Backend hosted on Render (free tier). First load may take up to **1–2 minutes**.

**Backend Repository:** [mindcare_backend](https://github.com/prachu25/mindcare_backend)

---

## Overview

MindCare Frontend is a lightweight web interface built using plain HTML, CSS, and JavaScript.  
It interacts with the Spring Boot backend via REST APIs to allow users to manage profiles, track mood and sleep, complete mental health assessments, and use a one-to-one support chat.

---

## Key Features

- User Authentication (Login & Registration)
- User Profile Management
- Daily Mood Tracking
- Mental Health Assessments
- Sleep Tracking
- One-to-One Support Chat
- Responsive and simple UI
- REST API integration with backend

---

## Tech Stack

Frontend:
- HTML5
- CSS3
- JavaScript (Vanilla JS)

Deployment:
- Vercel

Tools:
- VS Code
- Git & GitHub

---

## Project Structure

```text
mindcare_frontend/
├── audio/          # Audio files (alerts / relaxation sounds)
├── css/            # Stylesheets
├── images/         # Images and assets
├── js/             # JavaScript files (API calls & logic)
├── pages/          # Application pages (login, dashboard, etc.)
├── index.html      # Entry point
└── README.md       # Documentation
```

---

## How It Works

1. User interacts with the frontend UI
2. JavaScript sends requests to backend REST APIs
3. Backend processes data and returns responses
4. Frontend updates UI dynamically based on response

---

## Setup & Run Locally

### 1. Clone the repository
   ```bash
   git clone <your-frontend-repository-url>
   cd mindcare_frontend
   ```
### 2. Open index.html
   Either double-click the file Or use VS Code Live Server extension
### 3. Update Backend API URL
   Inside JS files, make sure the backend base URL is correct:
   ```bash
   const BASE_URL = "https://<your-backend-url>";
   ```

---
## Backend Dependency

This frontend depends on the MindCare Backend:

- Repository: [mindcare_backend](https://github.com/prachu25/mindcare_backend)
- Backend Tech: Java • Spring Boot • MySQL
- Deployment: Render

---

## License 
This project is licensed under the MIT License.

---

















