let characterCount = 2; // Start with 2

function addCharacter() {
    const fieldsBox = document.getElementById('fields-box');

    // Create Character Name Field
    const characterNameText = document.createElement('div');
    characterNameText.className = 'text-head';
    characterNameText.textContent = `Character Name ${characterCount}`;

    const characterNameInput = document.createElement('div');
    characterNameInput.className = 'input-container';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'text-field';
    inputField.placeholder = 'Enter Character Name';

    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    deleteIcon.innerHTML = '&#10006;'; // Cross icon

    // Add click event to delete the corresponding input box
    deleteIcon.addEventListener('click', function () {
        fieldsBox.removeChild(characterNameText);
        fieldsBox.removeChild(characterNameInput);
    });

    // Append elements to the input container
    characterNameInput.appendChild(inputField);
    characterNameInput.appendChild(deleteIcon);

    // Increment character count for the next field
    characterCount++;

    // Append elements to the container
    fieldsBox.insertBefore(characterNameText, fieldsBox.lastElementChild);
    fieldsBox.insertBefore(characterNameInput, fieldsBox.lastElementChild);

    // Apply animation
    setTimeout(() => {
        inputField.style.opacity = '1';
        inputField.style.transform = 'translateY(0)';
    }, 10);
}
