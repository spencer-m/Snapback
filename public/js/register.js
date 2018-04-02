
/**
 * When web app is loaded
 */
$(document).ready(function() {
    
    $('#prof').on('change', function() { 
        if ($(this).val() == 'Professor') {
            $('#regkeydiv').removeClass('invisible');
            $('#regkey').prop('required', true);
        }
        else {
            $('#regkeydiv').addClass('invisible');
            $('#regkey').prop('required', false);
            $('#regkey').val('');
        }
    });
    
    $('form').submit(function() {
        $('#submit').prop('disabled', true);
        return true;
    });
});

