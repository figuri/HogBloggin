const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get route for landing page (welcome.handlebars)

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User }],
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('welcome', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// get all posts for homepage (homepage.handlebars)

router.get('/homepage', async (req, res) => {
    try {
        // order posts by date created
        // include user and comment models to display username and comment text
        const postData = await Post.findAll({
            include: [{ model: User }, { model: Comment }], order: [['date_created', 'DESC']]
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        if (!req.session.loggedIn) {
            res.redirect('/login');
            return;
        }
        // pass serialized data and session flag into template
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// make a post(dashboard.handlebars)
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

// edit a post by ID (dashboard.handlebars)

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

// delete a post by ID (dashboard.handlebars)

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

// get route to display dashboard where user can create/edit/delete posts (dashboard.handlebars)

router.get('/dashboard', async (req, res) => {
    try {
      if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
      }
  
      const userId = req.session.user_id; 
      const posts = await Post.findAll({
        where: { user_id: userId }
      });
  
      console.log('Fetched posts:', posts);
      res.render('dashboard', { posts });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user posts');
    }
  });

//   route to make a comment on a post (homepage.handlebars)

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

// route to delete a comment by ID only if you are the user who made the comment (homepage.handlebars)

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

// login route (login.handlebars)
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
    console.log(res)
}

);
// signup route (signup.handlebars)
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
    console.log(res)
}
);

module.exports = router;