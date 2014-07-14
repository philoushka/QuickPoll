$(function() {

  applyQuestionTextToTweetButton();

  $('#formAnswer').on('submit', function(e) {
    $("#formAnswer input:text").map(function() {
      if (markIfInvalid($(this)) == false) {
        $('#errWarnBox').show();
        e.preventDefault();
      }
    });
  });
  $('#formAnswer input:text').blur(function() {
    markIfInvalid($(this));
  });
  function markIfInvalid(input) {
    if (!input.val()) {
      input.parent('div').addClass('has-error');
      return false;
    } else if (input.val()) {
      input.parent('div').removeClass('has-error');
    }
    return true;
  }
  function applyQuestionTextToTweetButton() {
    var tweetText = "Poll: " + $("#question").text().substring(0,110); //110 to ensure the user doesn't have to trim anything themselves.    
    $(".twitter-share-button").attr("data-text", tweetText);
  }

});

