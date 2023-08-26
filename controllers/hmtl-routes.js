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

// login route (login.handlebars)
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
    console.log(res)
});

// signup route (signup.handlebars)
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
    console.log(res)
});

// logout route 
router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.redirect('/');
            return;
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;