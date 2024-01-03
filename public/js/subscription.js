function updateButtonValue(boxId) {
    var selectedBoxInput = document.getElementById('selectedBoxId');
    selectedBoxInput.value = boxId;

    // Remove the selected class from all boxes
    var allBoxes = document.querySelectorAll('.box');
    allBoxes.forEach(function (box) {
        box.classList.remove('selected-box');
    });

    // Add the selected class to the clicked box
    var clickedBox = document.getElementById(boxId);
    clickedBox.classList.add('selected-box');

    // Special case for box-d
    if (boxId === 'discover') {
        var boxD = document.getElementById('box-d');
        boxD.classList.add('selected-box');
    }
}
