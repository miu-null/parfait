const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Parfait", postSchema);
