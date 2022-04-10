const express = require('express');
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
const databasePath = "database.db"

//DB functions
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

//cart handling
router.post( '/update', (req, res) => {
    //processing req data
    let product = req.body.name;
    let amount = parseInt(req.body.quantity);

    //using sessionID to group items of the same order
    var sessiondId = req.session.id;

    //logic for database communication
    if (req.session.loggedIn) {
        console.log(product + ' : ' + amount);
        const checkCart = "SELECT itemCount FROM orders WHERE sessionId=? AND foodItem=?";
        openDatabase();
        db.get(checkCart, [sessiondId, product], (err, result) => {
            if (err) {
                console.log(err.message);
            }
            if (result == undefined) {
                cartInsert(sessiondId, product, amount);
                res.send({ 'msg' : 'success'});
            }
            else {
                if (amount > 0) {
                    updateCart(sessiondId, product, amount);
                    res.send({ 'msg' : 'success'});
                }
                else {
                    removeFromCart(sessiondId, product);
                    res.send({ 'msg' : 'success'});
                }
            }
        });
        closeDatabase();
    }
    else {
        console.log('user not logged in');
        res.send({ 'msg' : 'notLoggedIn'});
    }
});


router.get('/retrieve', (req, res) => {
    const query = "SELECT * WHERE sessionId=?";
    var sessionId = req.session.id;

    if (req.session.loggedIn) {
        openDatabase();
        db.serialize(function() {
            db.get(query, sessionId, (err, result) => {
                if (err) {
                    console.log(err.message);
                }
                if (result = undefined) {
                    console.log('no existing cart');
                }
                else {
                    var cart = retrieveCart(sessionId);
                    res.send(cart);
                }
            });
        });
    }
    else {
        res.send({'msg' : 'notLoggedIn'});
    }
});

//order submission handling
router.get('/submit', (req, res) => {
    const userId = req.session.userID;
    var sessionId = req.session.id;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes();

    const sql = "INSERT INTO orderHistory (userId, sessionId, date) VALUES (?, ?, ?)";
    var input = [userId, sessionId, date];

    openDatabase();
    db.serialize(function() {
        db.run(sql, input, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                res.send ({'msg' : 'success'});
                console.log("Order stored in Database");
            }
        });
    });
});

//database communication functions
function cartInsert(sessiondId, foodItem, itemCount) {
    const insertCart = "INSERT INTO orders (sessionId, foodItem, itemCount) VALUES (?, ?, ?)";
    var input = [sessiondId, foodItem, itemCount];
    openDatabase();
    db.serialize( function() {
        db.run(insertCart, input, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("Added " + foodItem + " with amount: " + itemCount);
            }
        });
    });
    closeDatabase();
}

function updateCart(sessiondId, foodItem, itemCount) {
    const updateCart = "UPDATE orders SET itemCount = ? WHERE sessionId=? AND foodItem=?";
    var input = [itemCount, sessiondId, foodItem];
    openDatabase();
    db.serialize( function() {
        db.run(updateCart, input, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("Updated " + foodItem + "count to: " + itemCount);
            }
        });
    });
    closeDatabase();
}

function removeFromCart (sessiondId, foodItem) {
    const removeFromCart = "DELETE FROM orders WHERE sessionId=? AND foodItem=?";
    var input = [sessiondId, foodItem];
    openDatabase();
    db.serialize(function(){
        db.run(removeFromCart, input, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("Removed " + foodItem + " from cart");
            }
        });
    });
    closeDatabase();
}

function retrieveCart(sessionId) {
    const query = "SELECT foodItem, itemCount FROM orders WHERE sessionId=?";
    var order;
    openDatabase();
    db.serialize(function() {
        db.all(query, sessionId, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            else {
                order = result;
            }
        });
    });
    return order;
}

module.exports = router;