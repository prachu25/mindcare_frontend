
/* GLOBAL STATE */
let selectedGender = "male";

/* GENDER CARD SELECTION */
document.querySelectorAll(".gender-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".gender-card").forEach(c =>
            c.classList.remove("active")
        );
        card.classList.add("active");
        selectedGender = card.dataset.gender.toLowerCase(); // male / female
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(storedUser);

    const BASE_URL = "https://mindcare-backend-juwe.onrender.com";

    /* 1️. LOAD USER NAME (users table) */
    try {
        const resUser = await fetch(`${BASE_URL}/api/user/${user.id}`);
        if (!resUser.ok) throw new Error("User API failed");

        const userData = await resUser.json();
        console.log("USER DATA:", userData);

        // users.name → split fallback
        if (userData.name) {
            const parts = userData.name.split(" ");
            document.getElementById("firstName").value = parts[0] || "";
            document.getElementById("lastName").value =
                parts.slice(1).join(" ") || "";
        }

    } catch (err) {
        console.warn("User name not loaded", err);
    }

    /* 2️. LOAD PROFILE (user_profile table)*/
    try {
        const resProfile = await fetch(
            `${BASE_URL}/api/user/profile/${user.id}`
        );
        if (!resProfile.ok) return;

        const profile = await resProfile.json();
        console.log("PROFILE DATA:", profile);

        //  overwrite name only if profile has it
        if (profile.firstName) {
            document.getElementById("firstName").value = profile.firstName;
        }
        if (profile.lastName) {
            document.getElementById("lastName").value = profile.lastName;
        }

        document.getElementById("age").value = profile.age ?? "";
        document.getElementById("occupation").value = profile.occupation ?? "";
        document.getElementById("sleepHours").value = profile.sleepHours ?? "";
        document.getElementById("stressLevel").value = profile.stressLevel ?? "";

        // gender card sync
        if (profile.gender) {
            selectedGender = profile.gender.toLowerCase();
            document.querySelectorAll(".gender-card").forEach(card => {
                card.classList.toggle(
                    "active",
                    card.dataset.gender.toLowerCase() === selectedGender
                );
            });
        }

    } catch (err) {
        console.log("New user – no profile yet");
    }
});

/* SAVE / UPDATE PROFILE */
document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            alert("User not logged in");
            return;
        }

        const payload = {
            userId: user.id,

            //  NAME
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),

            //  PROFILE
            age: Number(document.getElementById("age").value),
            gender: selectedGender,
            occupation: document.getElementById("occupation").value.trim(),
            sleepHours: Number(document.getElementById("sleepHours").value),
            stressLevel: document.getElementById("stressLevel").value
        };

        console.log("SAVING PAYLOAD:", payload);

        try {
            const res = await fetch(`${BASE_URL}/api/user/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Save failed");

            localStorage.setItem("profileCreated", "true");
            window.location.href = "../pages/user-dashboard.html";

        } catch (err) {
            console.error(err);
            alert("Failed to save profile ");
        }
    });