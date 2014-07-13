$(function() {

    $('#formNew').on('submit', function(e) {
        $("#formNew input:text").map(function() {
            if (MarkIfInvalid($(this)) == false) {
                $('#errWarnBox').show();
                e.preventDefault();
            }
        });
    });
    $('#formAnswer input:text').blur(function() {
        MarkIfInvalid($(this));
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
        else
        {          
          notificationMsg = "Appears to be a non-US number. Please ensure that the number is complete with its country code."
        }
        $("#notificationMsg").text(notificationMsg);        
    });
    
    
    function MarkIfInvalid(input) {
        if (!input.val()) {
            input.parent('div').addClass('has-error');
            return false;
        } else if (input.val()) {
            input.parent('div').removeClass('has-error');
        }
        return true;
    }
});