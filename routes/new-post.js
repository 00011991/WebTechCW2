const express = require('express');
const router = express.Router();
const multer = require('multer');

const Post = require('../models/Post');
const fs = require('fs')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
        const [fileName, extension] = file.originalname.split('.')
        file.fieldname = `${fileName}-${Date.now()}.${extension}`
        cb(null, file.fieldname) //Appending .jpg
    }
})
const upload = multer({ storage: storage });
const deleteFile = async (file) => {
    fs.unlink(file, (err) => {
        if (err) throw err;

    });
}


router.route('/')
    .get(
        async (req, res) => {
            const posts = await Post.find({});

            res.render("index", { posts })
        })