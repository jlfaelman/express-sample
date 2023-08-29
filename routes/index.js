const express = require('express');
const router = express.Router();

// imports
const userRoutes = require('./userRoutes');


// routes

router.use('/user', userRoutes);





module.exports = router;