
/**
 * When web app is loaded
 */
$(document).ready(function() {
    
    $('#prof').on('change', function() { 
        if ($(this).val() === 'Professor') {
            $('#regkeydiv').removeClass('invisible');
            $('#regkey').prop('required', true);
        }
        else {
            $('#regkeydiv').addClass('invisible');
            $('#regkey').prop('required', false);
            $('#regkey').val('');
        }
    });

    $('#password, #confirm_password').on('keyup', function () {

        if ((($('#password').val().length >= 8) || ($('#confirm_password').val().length >= 8)) &&
            (($('#password').val().length <= 20) || ($('#confirm_password').val().length <= 20))) {

            if ($('#password').val() === $('#confirm_password').val())
                $('#passwordMsg').text('Passwords match.');
            else
                $('#passwordMsg').text('Passwords do not match.');
        }
        else
            $('#passwordMsg').text('Passwords must be 8-20 characters long.');
    });

    $('#email, #confirm_email').on('keyup', function () {
        
        if (validateEmail($('#email').val())) {
            if ($('#email').val() === $('#confirm_email').val())
                $('#emailMsg').text('Emails match.');
            else
                $('#emailMsg').text('Emails do not match.');
        }
        else {
            $('#emailMsg').text('Enter your email address.');
        }
    });
    
});

//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateForm() {

    $('#dynamic_alert').empty();

    if (!validateEmail($('#email').val())) {
        let emailerr = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Invalid email address.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#dynamic_alert').append(emailerr);
        return false;
    }

    if ($('#email').val() !== $('#confirm_email').val()) {
        let emailerr = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Emails do not match.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#dynamic_alert').append(emailerr);
        return false;
    }

    if ($('#password').val() !== $('#confirm_password').val()) {
        let passworderr = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Passwords do not match.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#dynamic_alert').append(passworderr);
        return false;
    }

    $('#submit').prop('disabled', true);
}


