$(function() {
    $("#submit-signup").on('click', function(e){
        // prevent form submit
        e.preventDefault();

        var formData = new FormData();
        formData.append('image', document.getElementById('profilePic').files[0]);
        formData.append('email', $('#signup-email').val());
        formData.append('password', $('#signup-pass').val());
        formData.append('firstName', $('#signup-firstname').val());
        formData.append('lastName', $('#signup-lastname').val());

        $.ajax({
            type : "POST",
            url : "http://localhost:3000/api/auth/signup",
            cache : false,
            processData: false,
            contentType: false,
            data : formData,
            success : function(data) {
                document.cookie='user_id='+data.userId;
                document.cookie='user_firstname='+data.firstName;
                document.cookie='user_lastname='+data.lastName;
                document.cookie='user_image='+data.image;
                document.cookie='access_token='+data.token;
                window.location.replace('/index.html');
            },
            error: function(data) {
                $("#signup-error").text(data.responseJSON.error);
            },
        });
    });

    $("#submit-login").on('click', function(e){
        // prevent form submit
        e.preventDefault();

        // json post data
        var data = {
            email: $('#login-email').val(),
            password: $('#login-pass').val(),
        };

        $.ajax({
            type : "POST",
            url : "http://localhost:3000/api/auth/login",
            cache : false,
            data : JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success : function(data) {
                document.cookie='user_id='+data.userId;
                document.cookie='user_firstname='+data.firstName;
                document.cookie='user_lastname='+data.lastName;
                document.cookie='user_image='+data.image;
                document.cookie='access_token='+data.token;
                window.location.replace('/index.html');
            },
            error: function(data) {
                $("#login-error").text(data.responseJSON.error);
            },
        });
    });
 });
