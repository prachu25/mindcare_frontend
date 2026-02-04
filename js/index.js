const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});


let whyIndex = 0;
const slides = document.querySelectorAll(".why-slide");
const dots = document.querySelectorAll(".why-dots .dot");

function showWhySlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        dots[i].classList.toggle("active", i === index);
    });
}

function nextWhySlide() {
    whyIndex = (whyIndex + 1) % slides.length;
    showWhySlide(whyIndex);
}

function prevWhySlide() {
    whyIndex = (whyIndex - 1 + slides.length) % slides.length;
    showWhySlide(whyIndex);
}

// AUTO SLIDE (every 4 seconds)
setInterval(nextWhySlide, 9000);

