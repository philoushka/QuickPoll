$(function() {
    $(".delTally").click(function(){
       $(this).closest('form').submit();
        return false;      
    });
});