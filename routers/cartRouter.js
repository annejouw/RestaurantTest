const express = require('express');
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
const databasePath = "database.db";

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

//check if inputvalue is >0, if not reject change
router.post('/change/:selectedchange', (req, res) =>{
    selectedChange = req.params.selectedchange;
    currentSession = req.sessionId;
    dishName = req.body;
    res.send('hoi');

    if (req.session.loggedIn) {
        if (selectedChange !== 'increase' || selectedChange !== 'decrease') {
            throw new Error('unexpected change received in cart')
        }

        openDatabase();
        db.serialize(function () {


        })
    }
    //user not logged in
    else {
    console.log('user not logged in');
    res.status(400).send("not logged in");
}
});

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

//Order submission handling
/* router.get('/submit', (req, res) => {
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
}); */

router.post('/submit', (req, res) => {
    let userID = req.session.userID;
    let sessionID = req.session.id;

    let currentOrderStatement = "SELECT foodItem, itemCount FROM orders WHERE sessionId = ?";
    openDatabase();
    db.serialize(function() {
        db.all(currentOrderStatement, [sessionID], (err, rows) => {
            if (err) {
                console.log(err.message);
            }

            if (rows) {
                console.log(rows);
                rows.forEach(row => addToOrderHistory(userID, sessionID, row));
                let deleteStatement = "DELETE FROM orders WHERE sesssionId = ?";
                db.run(deleteStatement, [sessionID], (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                });
                req.session.destroy(); //Destroy previous session
                req.session.loggedIn = true; //Create new session to get a new session ID
                req.session.userID = userID; //Link new session to current user
                res.send({ 'msg':'success'});
            }

            else {
                res.send({ 'msg':'empty' });
            }
        });
        closeDatabase();
    });
});

function addToOrderHistory (userID, sessionID, row) {
    let insertStatement = "INSERT INTO orderHistory (userId, sessionId, foodItem, itemCount) VALUES (?, ?, ?, ?)";
    db.run(insertStatement, [userID, sessionID, row.foodItem, row.itemCount], (err) => {
        if (err) {
            console.log(err.message);
        }
    });
}

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