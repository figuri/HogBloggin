const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//   make new comment

router.post('/comment', async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
        });
        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// get all comments

router.get('/comment', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [{ model: User }, { model: Post }],
        });
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get a comment by id

router.get('/comment/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [{ model: User }, { model: Post }],
        });
        const comment = commentData.get({ plain: true });
        res.json(comment);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// get comment by post id

router.get('/comment/post/:id', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: {
                post_id: req.params.id,
            },
            include: [{ model: User }, { model: Post }],
        });
        const comment = commentData.get({ plain: true });
        res.json(comment);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// delete a comment by id

router.delete('/comment/:id', async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        res.status(200).json(deletedComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// edit a comment by id

router.put('/comment/:id', async (req, res) => {
    try {
        const updatedComment = await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;