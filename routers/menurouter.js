var express = require('express');
const router = express.Router();

//when /menu is accessed
router.get('/', (req, res) => {
    console.log("menu router accessed")
    res.render('menu', { logStatus: req.session.loggedIn });
});

module.exports = router;