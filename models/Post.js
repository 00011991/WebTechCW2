
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    path:
    {
        type: String
    }
});

module.exports = mongoose.model("Post", PostSchema);