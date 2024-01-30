

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
            const cardValue = this.getAttribute('data-value');

            if (valueInput.value.includes(cardValue)) {
                // Remove the card value from the input field
                valueInput.value = valueInput.value
                    .split(', ')
                    .filter(value => value !== cardValue)
                    .join(', ');
            } else {
                // Add the card value to the input field
                valueInput.value += (valueInput.value === '' ? '' : ', ') + cardValue;
            }

            // Toggle the 'raised' class on the selected card
            this.classList.toggle('raised');
        });
    });
});

