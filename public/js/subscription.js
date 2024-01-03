// document.addEventListener('DOMContentLoaded', function() {
//     const boxes = document.querySelectorAll('.box');

//     boxes.forEach(box => {
//         box.addEventListener('click', function() {
//             const boxId = this.id; // Get the ID of the clicked box
//             sendDataToBackend(boxId); // Function to send data to the backend
//         });
//     });

//     function sendDataToBackend(boxId) {
//         fetch('/subscribe', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ boxId }) // Sending data to the '/subscribe' endpoint
//         })
//         .then(response => response.json())
//         .then(data => {
//             const redirectUrl = data.redirectUrl;
            
//             // Redirect the user to the received URL from the server
//             window.location.href = redirectUrl;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             // Handle error scenario
//         });
//     }
// });

function updateButtonValue(boxId) {
    var selectedBoxInput = document.getElementById('selectedBoxId');
    selectedBoxInput.value = boxId;
}

function validateForm() {
    var selectedBox = document.getElementById('selectedBoxId').value;
    if (selectedBox === "") {
        alert("Please select a subscription plan before proceeding.");
        return false; // Prevents form submission
    }
    return true; // Allows form submission if a box is selected
}
