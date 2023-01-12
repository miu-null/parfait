const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;
const commentSchema = mongoose.Schema({
    writer: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Comment", commentSchema);
