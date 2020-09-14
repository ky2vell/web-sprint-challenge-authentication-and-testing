const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./auth-model');

// @desc    Create user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findUser({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username already taken!'
      });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(
        password,
        parseInt(process.env.TIME_COMPLEXITY)
      )
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findUser({ username });

    if (!user) {
      return res.status(401).json({
        message: 'User not found!'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    // create JSON token
    const token = jwt.sign(
      {
        id: user.id,
        jokeAccess: true
      },
      process.env.TOKEN_SECRET
    );

    res.json({
      message: `Welcome ${user.username}!`,
      token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
