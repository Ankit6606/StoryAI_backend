function showNextPage() {
    var contentBox1 = document.getElementById("content-box-1");

    // Add fade-out animation to content-box-1
    contentBox1.style.animation = "fadeOut 1s ease-out forwards";

    // Wait for the animation to complete, then redirect to the next page
    setTimeout(function () {
        window.location.href = "/emotions"; // Replace with the actual URL of the next page
    }, 1000); // Adjust the timeout based on your fadeOut animation duration
}


document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const scenarioInput = document.getElementById('scenarioInput');
    let selectedValues = []; // Array to store selected values

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value');

            // Check if the card is already selected
            const isSelected = selectedValues.includes(cardValue);

            // Check if more than one card is selected
            if (!isSelected && selectedValues.length > 0) {
                alert("Only one scenario can be chosen. Deselect the current scenario before choosing another.");
                return;
            }

            // Toggle the selection status
            if (isSelected) {
                // If already selected, remove from the selectedValues array
                selectedValues = selectedValues.filter(value => value !== cardValue);
            } else {
                // If not already selected, add to the selectedValues array
                selectedValues.push(cardValue);
            }

            // Update the input field with the selected value
            scenarioInput.value = selectedValues.join(', ');

            // Toggle a CSS class for the raised effect
            this.classList.toggle('raised', !isSelected);
        });
    });
});