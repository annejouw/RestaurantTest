var sqlite3 = require('sqlite3').verbose();

const databasePath = "database.db"

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
router.post('/:category', (req, res) => {
    console.log("dish router category accessed");
    var requestedCategory = req.params.category;

    //retrieve JSON representing all dishes in this category, with appropriate values
    openDatabase();

    const requestItemQuery = "SELECT * FROM " + requestedCategory + " WHERE dishID=?"

    db.all()


    // const infoQuery = "SELECT dishID, dishName, price, imageURL, numberOfItems, ingredients FROM Sashimi WHERE dishID=?";
    // db.serialize(function() {
    //     openDatabase();
    //     db.get(infoQuery, [userID], (err, row) => {
    //         if (err) {
    //             console.log(err.message);
    //         }
    //         if (row) {
    //             let data = {
    //                 'msg':'success',
    //                 'firstName':row.firstName,
    //                 'lastName':row.lastName,
    //                 'email':row.email,
    //                 'phone':row.phone,
    //                 'streetAddress':row.streetAddress,
    //                 'zipCode':row.zipCode,
    //                 'city':row.city
    //             };
    //             res.send(data);
    //         }
    //     });
    //     closeDatabase();
    // });

    res.send(categoryJSON)
});

router.get('/', (req, res) => {
    console.log("dish router accessed")
});

module.exports = router;