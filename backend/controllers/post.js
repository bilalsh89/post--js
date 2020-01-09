const Post = require('../models/post');
const fs = require('fs');

exports.addPost = (req, res, next) => {
  const postData = req.body;
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    userName: postData.userName, 
    userProfilePic: postData.userProfilePic, 
    date: Date.now(), 
    text: postData.text, 
    imageUrl: url + '/images/' + req.file.filename, 
    userId : postData.userId
  });
  post.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error.message
      });
    }
  );
};

exports.getAllPosts = (req, res, next) => {
  Post.find().then(
    (posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error.message
      });
    }
  );
};

exports.likePost = (req, res, next) => {
  const data = req.body;
  Post.findOne({_id: req.params.id}).then(
    (post) => {
      const likeIndex = post.usersLiked.indexOf(data.userId);
      const dislikeIndex = post.usersDisliked.indexOf(data.userId);
      let msg = '';

      if (data.like === 0) {
        if (likeIndex > -1) {
          post.usersLiked.splice(likeIndex, 1);
          post.likes--;
        } else if (dislikeIndex > -1) {
          post.usersDisliked.splice(dislikeIndex, 1);
          post.dislikes--;
        }
      } else if (data.like === 1) {
          post.usersLiked.push(data.userId);
          post.likes++;
          msg = "You have liked this post";
      } else if (data.like === -1) {
          post.usersDisliked.push(data.userId);
          post.dislikes++;
          msg = "You have disliked this post";
      }

      post.save(function(error, post) {
          if (error) {
            res.status(400).json({
              error: error.message
            });
          } else {
            res.status(200).json({ message: msg });
          }
      });
    });
};
