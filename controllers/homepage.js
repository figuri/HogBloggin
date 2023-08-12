const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

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

router.get('/dashboard', async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
                include: [{ model: Post }],
                });
        const user = userData.get({ plain: true });
        res.render('dashboard', {
            ...user,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
);

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
}
);

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
}
);

module.exports = router;