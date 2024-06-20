const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    image: {
        type: String,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
});
const pinSchema = new mongoose.Schema({
    title: String,
    name: String,
    destination: String,
    category: String,
    image: String,
    userId: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    savePost: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const commentSchema = new mongoose.Schema({
    comment: String,
    pinId: { type: mongoose.Schema.Types.ObjectId, ref: "Pin" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Pin = mongoose.model("Pin", pinSchema);
const User = mongoose.model("User", userSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Pin, User, Comment };
