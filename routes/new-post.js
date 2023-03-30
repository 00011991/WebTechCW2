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
router.route('/new')
    .get((req, res) => {
        var err = req.session.err;
        res.render('newPost', { err })
    })
    .post(upload.single('image'), async (req, res, next) => {
        try {
            const post = new Post({ ...req.body, path: req.file ? req.file.filename : "" })
            await post.save()
            res.redirect('/')
        } catch (error) {
            next(error)
        }

    })

router.route('/post/:id')
    .get(async (req, res) => {
        const post = await Post.findById({ _id: req.params.id })
        res.render('postDetails', { post })
    })
    .delete(async (req, res) => {
        const post = await Post.findByIdAndDelete(req.params.id)
        post.path.length !== 0 && await deleteFile(`public/uploads/${post.path}`)
        res.redirect(`/`)
    })
    .put(upload.single('image'), async (req, res) => {
        const { id } = req.params;
        const { title, desc } = req.body
        const post = await Post.findById(id);
        post.title = title;
        post.desc = desc;
        if (req.file) {
            if (post.path.length > 0) {
                await deleteFile(`public/uploads/${post.path}`);
            }
            post.path = req.file.filename;
        }
        await post.save();
        res.redirect(`/post/${req.params.id}`)
    })

router.route('/post/edit/:id')
    .get(async (req, res) => {
        const post = await Post.findById({ _id: req.params.id })
        res.render('editPost', { post })
    })



module.exports = router;
