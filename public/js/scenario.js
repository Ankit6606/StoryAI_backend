
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const scenarioInput = document.getElementById('scenarioInput');
    let selectedValue = null; // Variable to store the selected value

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardValue = this.getAttribute('data-value');

            
            const isSelected = selectedValues.includes(cardValue);

             
            if (isSelected) {
                
                selectedValues = selectedValues.filter(value => value !== cardValue);
            } else {
 
                selectedValues.push(cardValue);
            }

      
            scenarioInput.value = selectedValues.join(', ');

        
            this.classList.toggle('raised', !isSelected);
        });
    });
    
});
