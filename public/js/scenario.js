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

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value'); // Get the value from data attribute
            sendDataToBackend(cardValue); // Function to send data to the backend
        });
    });

    function sendDataToBackend(value) {
        // You can use fetch or XMLHttpRequest to send the data to the backend
        // Example using fetch:
        fetch('/your-backend-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: value })
        })
        .then(response => {
            // Handle the response from the backend if needed
            console.log('Data sent to backend:', value);
        })
        .catch(error => {
            // Handle errors
            console.error('Error sending data to backend:', error);
        });
    }
});