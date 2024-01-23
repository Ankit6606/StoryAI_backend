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


