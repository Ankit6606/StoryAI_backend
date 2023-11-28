let characterCount = 2; // Start with 2

        function addCharacter() {
            const fieldsBox = document.getElementById('fields-box');

            // Create Character Name Field
            const characterNameText = document.createElement('div');
            characterNameText.className = 'text-head';
            characterNameText.textContent = `Character Name ${characterCount}`;

            const characterNameInput = document.createElement('input');
            characterNameInput.type = 'text';
            characterNameInput.className = 'text-field';
            characterNameInput.placeholder = 'Enter Character Name';

            // Increment character count for the next field
            characterCount++;

            // Append elements to the container
            fieldsBox.insertBefore(characterNameText, fieldsBox.lastElementChild);
            fieldsBox.insertBefore(characterNameInput, fieldsBox.lastElementChild);

            // Apply animation
            setTimeout(() => {
                characterNameInput.style.opacity = '1';
                characterNameInput.style.transform = 'translateY(0)';
            }, 10);
        }

