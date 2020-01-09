$(function() {
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    var userId = getCookie('user_id');
    var userFirstName = getCookie('user_firstname');
    var userLastName = getCookie('user_lastname');
    var userProfilePic = getCookie('user_image');
    var accessToken = getCookie('access_token');

    $('#userName').text(userLastName + ' ' + userFirstName);
    $('#profilePic').attr('src', userProfilePic);

    $('.logout').on('click', function(e) {
        document.cookie='user_id=';
        document.cookie='access_token=';
        window.location.replace('/auth.html');
    });

    $('.delete-button').on('click', function() {
        $.ajax({
            type : "DELETE",
            url : "http://localhost:3000/api/auth/"+userId,
            success : function(data) {
                document.cookie='user_id=';
                document.cookie='access_token=';
                window.location.replace('/auth.html');
            },
            error: function(data) {
                alert(data.responseJSON.error);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + accessToken); }
        });
    });
});