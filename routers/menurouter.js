/* This file contains the router for routing to the menu page '/menu' */

var express = require('express');
const router = express.Router();

//when /menu is accessed
router.get('/', (req, res) => {
    res.render('menu', { logStatus: req.session.loggedIn });
});

module.exports = router;