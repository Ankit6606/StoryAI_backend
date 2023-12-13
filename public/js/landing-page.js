const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;

function updateSlider() {
    const imageWidth = slider.clientWidth; // Get the width of the slider container
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

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
    updateDots();
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

// Update slider on window resize
window.addEventListener("resize", updateSlider);

// Initial update
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
  // JavaScript to handle box visibility in mobile version
  document.addEventListener("DOMContentLoaded", function () {
    var imageBoxes = document.querySelectorAll(".image-box-x");
    var currentIndex = 0;

    function updateBoxVisibility() {
        for (var i = 0; i < imageBoxes.length; i++) {
            if (i === currentIndex) {
                imageBoxes[i].classList.add("active-box");
            } else {
                imageBoxes[i].classList.remove("active-box");
            }
        }
    }

    function cycleBoxes() {
        currentIndex = (currentIndex + 1) % imageBoxes.length;
        updateBoxVisibility();
    }

    setInterval(cycleBoxes, 2000);

    updateBoxVisibility();
});
