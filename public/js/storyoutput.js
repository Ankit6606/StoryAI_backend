var audio = document.getElementById("audio");
var playPauseIcon = document.getElementById("play-pause-icon");
var progressBar = document.getElementById("progress-bar");
var slider = document.getElementById("slider");
var timer = document.getElementById("timer");

function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        playPauseIcon.style.animationName = "none";
        animateProgressBar();
        updateTimer();
    } else {
        audio.pause();
        playPauseIcon.style.animationName = "rotate";
    }
}

function animateProgressBar() {
    var duration = audio.duration;

    function updateProgress() {
        var currentTime = audio.currentTime;
        var progress = (currentTime / duration) * 100;
        slider.style.left = progress + "%";

        // Calculate the color stop percentage based on progress
        var colorStop = 100 - progress;

        // Update the background gradient of the progress bar
        progressBar.style.background = `linear-gradient(270deg, #BB80FF 0%, #BB80FF ${colorStop}%, #FFA8CF ${colorStop}%, #FFA8CF 100%)`;

        requestAnimationFrame(updateProgress);
    }

    updateProgress();
}


function updateTimer() {
    var duration = audio.duration;

    function updateTime() {
        var currentTime = audio.currentTime;
        var minutes = Math.floor(currentTime / 60);
        var seconds = Math.floor(currentTime % 60);
        var totalMinutes = Math.floor(duration / 60);
        var totalSeconds = Math.floor(duration % 60);

        timer.textContent = pad(minutes) + ":" + pad(seconds) + " / " + pad(totalMinutes) + ":" + pad(totalSeconds);

        if (!audio.paused) {
            requestAnimationFrame(updateTime);
        }
    }

    updateTime();
}

function pad(num) {
    return num.toString().padStart(2, "0");
}

audio.addEventListener("play", function () {
    playPauseIcon.style.animationName = "none";
    animateProgressBar();
    updateTimer();
});

audio.addEventListener("pause", function () {
    playPauseIcon.style.animationName = "rotate";
});

// Add event listeners for slider drag functionality
var isDragging = false;

slider.addEventListener("mousedown", function (e) {
    isDragging = true;
    updateSliderPosition(e);
});

document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        updateSliderPosition(e);
    }
});

document.addEventListener("mouseup", function () {
    isDragging = false;
});

function updateSliderPosition(e) {
    var progressBarRect = progressBar.getBoundingClientRect();
    var newPosition = (e.clientX - progressBarRect.left) / progressBarRect.width * 100;

    // Ensure the new position is within the valid range (0-100)
    newPosition = Math.max(0, Math.min(newPosition, 100));

    slider.style.left = newPosition + "%";
    audio.currentTime = (newPosition / 100) * audio.duration;
}