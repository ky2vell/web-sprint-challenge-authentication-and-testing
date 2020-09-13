require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const error = require('../middleware/error');
const colors = require('colors');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

// API Routes
server.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Unknown API'
  });
});
server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

// Error MiddleWare
server.use(error);

module.exports = server;
