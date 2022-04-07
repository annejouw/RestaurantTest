var express = require('express');
var sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const databasePath = "database.db"

router.all('/', (req, res) => {
    console.log("dish router accessed")
});

function openDatabase() {
    db = new sqlite3.Database(databasePath, (err) => {
        if (err) {
            return console.error(err.message);
        }

        console.log("Connected to the in-memory SQLite database");
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

let dishQuery = "SELECT" + + "FROM"

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
router.post('/:category', (req, res) => {
    var requestedCategory = req.params.category;
    console.log("dish router category " + requestedCategory + " accessed");

    //retrieve JSON representing all dishes in this category, with appropriate values
    openDatabase();

    const requestItemQuery = "SELECT * FROM " + requestedCategory

    db.all(requestItemQuery, (err, dishData) => {
        if (err) {
            console.log(err.message);
        }
        categoryDishesJSON = JSON.stringify(dishData);
        res.send(categoryDishesJSON);
    });

    closeDatabase();
});

module.exports = router;