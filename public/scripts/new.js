$(function() {

    $('#formNew').on('submit', function(e) {
        //$("#formNew input:text").map(function() {
        $(".required").map(function() {
            if (markIfInvalid($(this)) == false) {
                $('#errWarnBox').show();
                e.preventDefault();
            }
        });
    });
    $('.required').blur(function() {
        markIfInvalid($(this));
    });
        
     $('#notification').blur(function() {
        var notificationMsg="";
        var input=$("#notification").val().trim(); 
        
        if (input.indexOf("@")>-1)        {return;}
        input = input.replace(/\D/g,'');
        if(input.length==10)
        {
          notificationMsg= "US/Canada phone number."
        }
        else if (input.length>0)
        {          
          notificationMsg = "Appears to be a non-US number. Please ensure that the number is complete with its country code."
        }
        $("#notificationMsg").text(notificationMsg);        
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
});