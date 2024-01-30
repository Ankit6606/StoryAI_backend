
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const scenarioInput = document.getElementById('scenarioInput');
    let selectedValue = null; // Variable to store the selected value

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value');

            // If a card is already selected, remove its value from the input field
            if (selectedValue !== null) {
                scenarioInput.value = '';
            }

            // Update the selectedValue variable
            selectedValue = cardValue;

            // Update the input field with the selected value
            scenarioInput.value = selectedValue;

            // You can add additional logic here based on your requirements

        });
    });
    
});
