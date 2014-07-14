$(function() {
  $(".delTally").click(function() {
    var id = $(this).attr("href").split("|")[0];
    var token = $(this).attr("href").split("|")[1];
    var rowToHide = $(this).closest("tr");

    $.ajax({
      type: "DELETE",
      url: "delete/" + id + "/" + token,
      success: function(response) {
        var deleteResult = jQuery.parseJSON(response);
        if (deleteResult.deleteSuccess) {
          rowToHide.delay(200).fadeOut(1500);
          rowToHide.animate({
            "opacity": "0",
          }, {
              "complete": function() {
                rowToHide.remove();
              }
            });
        }
        else
        { alert("Something didn't work when trying to delete that, sorry."); }
        return false;
      }
    });
    return false;
  });
});