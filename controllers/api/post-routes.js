const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get post by ID 

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User }, { model: Comment }],
        });
        const post = postData.get({ plain: true });
        res.json(post);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// make a post(dashboard.handlebars)
router.post('/post', async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
            title: req.body.title,
            post_text: req.body.post_text,
            date_created: req.body.date_created,
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// edit a post by ID (dashboard.handlebars)

router.put('/post/:id', async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// delete a post by ID (dashboard.handlebars)

router.delete('/post/:id', async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;