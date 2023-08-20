const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

// get route to display all posts from all users (homepage)

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User }],
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// make a post

router.post('/create', async (req, res) => {
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

// edit a post by ID

router.put('/update/:id', async (req, res) => {
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

// delete a post by ID

router.delete('/delete/:id', async (req, res) => {
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

// get route to display dashboard where user can create/edit/delete posts

router.get('/dashboard', async (req, res) => {
    try {
      const posts = await Post.findAll({
        where: { user_id: req.session.user_id }
      });
      
      console.log('Fetched posts:', posts);
  
      res.render('dashboard', { posts });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user posts');
    }
  });

//   route to make a comment on a post

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

// route to delete a comment by ID only if you are the user who made the comment

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

// login route
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
}
);
// signup route
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
}
);

module.exports = router;