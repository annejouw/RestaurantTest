var express = require('express');
const router = express.Router();
var jsondish = {
    "id": "1",
    "name": "salmon sashimi",
    "imageurl": "/images/sashimi-salmon.jpg",
    "category": "sashimi",
    "price": "8.50",
    "ingredients": "salmon",
    "vegetarian": "false"
}

//when dishes are accessed
router.post('/:dishID', (req, res) => {
    console.log("dish router dish accessed")
    var requestedDishID = req.params.dishID
    res.send(JSON.stringify(jsondish))
});



router.get('/', (req, res) => {
    console.log("dish router accessed")
});

module.exports = router;