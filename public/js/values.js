

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
    let selectedValues = []; // Array to store selected values

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value');

            // Remove the erased part from the selectedValues array
            selectedValues = selectedValues.filter(value => valueInput.value.includes(value));

            if (!selectedValues.includes(cardValue)) {
                selectedValues.push(cardValue); // Add value to the array if not already present
            }
            valueInput.value = selectedValues.join(', '); // Update the input field with comma-separated values
        });
    });
});