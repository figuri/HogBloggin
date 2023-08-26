const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Post, Comment } = require('../../models');

// create user and sign up
router.post('/signup', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = user.id;
      res.status(200).json(user);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all users
router.get('/user', async (req, res) => {
  try {
    const userData = await User.findAll({
      include: [{ model: Post }, { model: Comment }],
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single user by id
router.get('user/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Post }],
    });
    const user = userData.get({ plain: true });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// edit a user by ID
router.put('user/:id', async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete a user by ID
router.delete('user/:id', async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      dbUserData.password
    );

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.user_id = dbUserData.id;

      console.log('Session data after login:', req.session);

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;