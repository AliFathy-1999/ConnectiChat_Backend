const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const messageRoutes = require('./message');


router.use('/user', userRoutes);
router.use('/message', messageRoutes);


module.exports = router;
