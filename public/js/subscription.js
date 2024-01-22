// subscription.js

function updateHiddenInput() {
  // Get the ID of the selected box
  var selectedBoxId = $('.box.clicked').attr('id');
  
  // Update the hidden input field value
  $('#selectedBoxId').val(selectedBoxId);
}

$(document).ready(function() {
  // Add click handlers to boxes with respective IDs
  $('.box').click(function() {
      // Remove 'clicked' class from all boxes
      $('.box').removeClass('clicked');

      // Add 'clicked' class to the selected box
      $(this).addClass('clicked');
  });
});


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
