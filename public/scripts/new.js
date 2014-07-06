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