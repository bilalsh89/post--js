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

    if (!userId || userId === '' || !accessToken || accessToken === '') {
        window.location.replace('/auth.html');
    }

    $('#userName').text(userLastName + ' ' + userFirstName);
    $('#profilePic').attr('src', userProfilePic);

    $('.logout').on('click', function(e) {
        document.cookie='user_id=';
        document.cookie='access_token=';
        window.location.replace('/auth.html');
    });

    // get all posts
    $.ajax({
        url: "http://localhost:3000/api/posts",
        dataType: 'json',
        success: function(data) {
            console.log(data[0]);
            var postHtml = '';
            data.forEach(function(post) {
                var postDate = new Date(post.date);
                var likeColor = 'grey', dislikeColor = 'grey';
                var postLiked = false, postDisliked = false;
                if (post.usersLiked && post.usersLiked.length > 0 && post.usersLiked.includes(userId)) {
                    likeColor = 'green';
                    postLiked = true;
                }
                
                if (post.usersDisliked && post.usersDisliked.length > 0 && post.usersDisliked.includes(userId)) {
                    dislikeColor = 'red';
                    postDisliked = true;
                }
                
                postHtml = '<div data-id="'+post._id+'">' +
                '<div class="row">'+
                '<img alt="" src="'+ (post.userProfilePic ? post.userProfilePic : 'images/personal-user-illustration-@2x.png') +'" style="border-radius: 50%;float:left;" width="50" height="50" />'+
                '<h2 style="margin-left: 0.5em;">'+post.userName+'</h2>' +
                '</div>'+
                '<h5>'+postDate.toDateString()+'</h5>' +
                '<p>'+post.text+'</p>' +
                '<div style="width: 80%;margin: 0 auto;"><img src="'+post.imageUrl+'" alt="" width="100%" height="auto"></div>' +
                '<a class="like" activated="'+postLiked+'"><i class="fa fa-thumbs-o-up" style="font-size:20px;color:'+likeColor+';margin:5px;"></i></a>' + post.likes +
                '<a class="dislike" activated="'+postDisliked+'"><i class="fa fa-thumbs-o-down" style="font-size:20px;color:'+dislikeColor+';margin:5px;"></i></a>' + post.dislikes +
                '</div><br/>';
                $('.main').append(postHtml);
          });
        },
        beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + accessToken); } 
      });

      $("#submit-post").on('click', function(e){
        // prevent form submit
        e.preventDefault();

        var formData = new FormData();
        formData.append('image', document.getElementById('postImage').files[0]);
        formData.append('text', $('#post-text').val());
        formData.append('userId', userId);
        formData.append('userName', userLastName + ' ' + userFirstName);
        formData.append('userProfilePic', userProfilePic);

        $.ajax({
            type : "POST",
            url : "http://localhost:3000/api/posts",
            cache : false,
            processData: false,
            contentType: false,
            data : formData,
            success : function(data) {
                window.location.reload();
            },
            error: function(data) {
                $("#post-error").text(data.responseJSON.error);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + accessToken); }
        });
    });

    function like(e, like) {
        console.log(e);
        var postId = e.parent().attr('data-id');
        var activated = e.attr('activated') === 'true';
        var data = {
            like: activated ? 0 : like,    
            userId: userId,
        }

        $.ajax({
            type : "POST",
            url : "http://localhost:3000/api/posts/"+postId+"/like",
            cache : false,
            data : JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success : function(data) {
                window.location.reload();
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + accessToken); }
        });
    }

    $(document).on('click', '.like', function(e){
        like($(this), 1);
    });

    $(document).on('click', '.dislike', function(e){
        like($(this), -1);
    });
    
});