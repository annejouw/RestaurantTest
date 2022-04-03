var express = require('express');
const router = express.Router();

//when /menu is accessed
router.get('/', (req, res) => {
    console.log("menu router accessed")
    res.render('menu', { logStatus: req.session.loggedIn });
});

//when /menu/page 1 is accessed
router.get('/page/:pageNumber', (req, res) => {
    case req.params.pageNumber


});

module.exports = router;