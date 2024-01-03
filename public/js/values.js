

function showNextPage() {
    var contentBox1 = document.getElementById("content-box-1");

    // Add fade-out animation to content-box-1
    contentBox1.style.animation = "fadeOut 1s ease-out forwards";

    // Wait for the animation to complete, then redirect to the next page
    setTimeout(function () {
        window.location.href = "/"; // Replace with the actual URL of the next page
    }, 1000); // Adjust the timeout based on your fadeOut animation duration
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const valueInput = document.getElementById('valueInput');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value'); // Get the value from data attribute
            valueInput.value = cardValue; // Set the input field value to the card's data-value
        });
    });
});
function selectCard(card) {
    // Remove the selected class from all cards
    var allCards = document.querySelectorAll('.card');
    allCards.forEach(function (c) {
        c.classList.remove('selected-card');
    });

    // Add the selected class to the clicked card
    card.classList.add('selected-card');
}
