

/**
 * When web app is loaded
 */
$(document).ready(function() {
    $('form').submit(function() {
        $('#submit').prop('disabled',true);
        return true;
    });
});

