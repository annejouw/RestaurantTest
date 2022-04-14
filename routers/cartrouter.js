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
router.post('/change', (req, res) =>{
    let selectedChange = req.body.change;
    let currentSession = req.session.id;
    let dishName = req.body.dishname;

    console.log('item: ' + dishName + ' sessionid: ' + currentSession)


    if (req.session.loggedIn) {
        switch (selectedChange){
            case 'increase':
                increaseItemAmount(currentSession, dishName);
                break;
            case 'decrease':
                decreaseItemAmount(currentSession, dishName);
                break;
            default:
                throw new Error('unexpected change received in cart');
        }
    }
    //user not logged in
    else {
    res.status(400).send("Can't order items, you are not logged in");
}
});

function increaseItemAmount(currentSession, dishName){
    openDatabase();
    db.serialize(function (){
        /*
        1 check if item exists for this sessionID
        2 if it does not, create new row with this sessionID and item, set amount to 1 if increase. then done.
        3 if the item does exist, check (amount with this sessionID)
        4 calculate (amount with this sessionID) + 1 and update the amount to this number. then done.
        */
        const checkCartQuery = "SELECT itemCount FROM orders WHERE sessionId=$toCheckId AND foodItem=$toCheckItem";
            db.get(checkCartQuery, {
                $toCheckItem : dishName,
                $toCheckId : currentSession
            }, (err, result) => {
                if (err) {
                    console.log(err.message);
                }
                if (!result) {
                    //dish does not exist yet
                    addDishToOrder(currentSession, dishName);
                }
                else {
                    //dish exists
                    oldAmount = result.itemCount
                    let newAmount = oldAmount + 1;
                    const ItemCountQuery = "UPDATE orders SET itemCount = $newamount WHERE sessionid = $sessionid AND foodItem = $fooditem"
                    openDatabase();
                    db.serialize( function() {
                        db.run(ItemCountQuery, {
                            $sessionid:currentSession,
                            $fooditem:dishName,
                            $newamount:newAmount
                        }, (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                            else {
                                console.log("increased " + dishName + " by one");
                            }
                        });
                    });
                }
        });
        closeDatabase()
    })
}

function decreaseItemAmount(currentSession, dishName){
    openDatabase();
    db.serialize(function (){
        /*
        1 check if item exists for this sessionID
        2 if it does not, create new row with this sessionID and set the item amount to 0. then done.
        3 if the item does exist, check (mount with this sessionID)
        5 Check if (amount with this sessionID) is equal to or larger than 1,
        6 decrease (amount with this sessionID) by 1 if it is. then done.
        7 set (amount with this sessionID) to 0 if it is not. then done.
        */
        const checkCartQuery = "SELECT itemCount FROM orders WHERE sessionId=$toCheckId AND foodItem=$toCheckItem";
        db.get(checkCartQuery, {
            $toCheckItem : dishName,
            $toCheckId : currentSession
        }, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            if (!result) {
                //dish does not exist yet, do nothing since
            }
            else {
                //dish exists
                oldAmount = result.itemCount;
                if (oldAmount => 1){
                    let newAmount = oldAmount - 1;
                    const ItemCountQuery = "UPDATE orders SET itemCount = $newamount WHERE sessionid = $sessionid AND foodItem = $fooditem"
                    openDatabase();
                    db.serialize(function() {
                        db.run(ItemCountQuery, {
                            $sessionid:currentSession,
                            $fooditem:dishName,
                            $newamount:newAmount
                        }, (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                            else {
                                console.log("increased " + dishName + " by one");
                            }
                        });
                    });
                }
                //itemCount is 1 or less, so remove the item
                const deleteQuery = "DELETE FROM orders where sessionId = $sessionid AND foodItem = $fooditem";
                openDatabase()
                db.serialize(function() {
                    db.run(deleteQuery, {
                        $sessionid:currentSession,
                        $fooditem:dishName,
                    })
                });
            }
        });
        closeDatabase()
    })
}

function addDishToOrder(currentSession, dishName){
    const insertDishQuery = "INSERT INTO orders (sessionId, foodItem, itemCount) VALUES ($sessionid, $fooditem, $itemcount)";
    openDatabase();
    db.serialize( function() {
        db.run(insertDishQuery, {
            $sessionid:currentSession,
            $fooditem:dishName,
            $itemcount:1
        }, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("Added " + dishName + " to order");
            }
        });
    });
    closeDatabase();
}

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
                let deleteStatement = "DELETE FROM orders WHERE sessionId = ?";
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
