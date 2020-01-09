const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/post');

router.post('/', auth, multer, postCtrl.addPost);
router.get('/', auth, postCtrl.getAllPosts);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;