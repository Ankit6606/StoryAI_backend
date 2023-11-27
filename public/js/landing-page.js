const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const imageWidth = 990; // Width of each slide
let currentIndex = 0;

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
    updateDots();
}

function updateSlider() {
    const translateX = -currentIndex * imageWidth;
    slider.style.transform = `translateX(${translateX}px)`;
}

function updateDots() {
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.style.fill = "#CDADFF"; // Active dot color
        } else {
            dot.style.fill = "#615476"; // Inactive dot color
        }
    });
}

// Automatically advance the slider every 3 seconds
setInterval(nextSlide, 3000);

// Enable swiping to change images
let startX = 0;
let currentX = 0;

slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

slider.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX;
});

slider.addEventListener("touchend", () => {
    const difference = startX - currentX;
    if (difference > 50) {
        nextSlide();
    }
});

updateSlider();
updateDots();

document.addEventListener("DOMContentLoaded", function() {
    const questionBoxes = document.querySelectorAll(".question-box");

    questionBoxes.forEach((box, index) => {
      box.addEventListener("click", function() {
        const answer = this.closest(".faq-item").querySelector(".answer");
        answer.style.display = answer.style.display === "block" ? "none" : "block";

        // Close other open answers (optional)
        questionBoxes.forEach((otherBox, otherIndex) => {
          if (otherIndex !== index) {
            const otherAnswer = otherBox.closest(".faq-item").querySelector(".answer");
            otherAnswer.style.display = "none";
          }
        });
      });
    });
    questionBoxes.forEach((box, index) => {
        box.addEventListener("click", function() {
          const answer = this.closest(".faq-item").querySelector(".answer-width2");
          answer.style.display = answer.style.display === "block" ? "none" : "block";
  
          // Close other open answers (optional)
          questionBoxes.forEach((otherBox, otherIndex) => {
            if (otherIndex !== index) {
              const otherAnswer = otherBox.closest(".faq-item").querySelector(".answer-width2");
              otherAnswer.style.display = "none";
            }
          });
        });
      });
    

  });