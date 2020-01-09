const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	userName: {type: String, required: true },
	userProfilePic: {type: String, required: true }, 
	text: {type: String, required: true }, 
	date: {type: Date, required: true, default: Date.now }, 
	imageUrl: {type: String, required: true }, 
	userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	likes: {type: Number, default:0},
	dislikes: {type: Number, default:0},
	usersLiked: {type: [String]},
	usersDisliked: {type: [String]}
});

module.exports = mongoose.model('Post', postSchema);