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


router.post('/change', (req, res) =>{
    let selectedChange = req.body.change;
    let currentSession = req.session.id;
    let dishName = req.body.dishname;

    console.log('item: ' + dishName + ' sessionid: ' + currentSession)

    if (req.session.loggedIn) {
        if (selectedChange === 'increase' || selectedChange === 'decrease'){
            changeItemAmount(currentSession, dishName, selectedChange);
            res.sendStatus(200);
        }
        else throw new Error('unexpected change received in cart');
        } else {
        res.status(400).send("Can't order items, you are not logged in");
    }

    //user not logged in

});
/*
first, check if dish exists in the order for this sessionID.
If the dish doesn't exist and user wants to increase, create it.

If the dish does exist, check if user wants to increase or decrease

for increase, increase itemCount by 1 for this item

for decrease, check if itemCount is one or less.
If itemcount<=1, delete it
If itemcount>1, decrease itemCount by one
*/
async function changeItemAmount(currentSession, dishName, selectedChange){
    openDatabase();
    db.serialize(function (){
        const checkCartQuery = "SELECT itemCount FROM orders WHERE sessionId=$toCheckId AND foodItem=$toCheckItem";
        db.get(checkCartQuery, {
            $toCheckItem : dishName,
            $toCheckId : currentSession
        }, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            if (!result) {
                if (selectedChange === 'increase'){
                    addDishToOrder(currentSession, dishName)
                }
                //if the item doesn't exist, but user wants to decrease, do nothing
            }
            else {
                oldAmount = result.itemCount;
                if (selectedChange === 'increase') {
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
                } else {
                    //selectedchange is 'decrease'
                    if (oldAmount > 1){
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
                                    console.log("decreased " + dishName + " by one");
                                }
                            });
                        });
                    } else {
                        //delete item entry
                        const deleteQuery = "DELETE FROM orders where sessionId = $sessionid AND foodItem = $fooditem";
                        openDatabase()
                        db.serialize(function() {
                            db.run(deleteQuery, {
                                $sessionid:currentSession,
                                $fooditem:dishName,
                            })
                        });
                    }
                }
            }
        });
        closeDatabase();
    })
}

//adds a dish to an order if it doesn't exist yet
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
    let currentSession = req.session.id;
    const retrieveOrderQuery = "SELECT foodItem, itemCount FROM orders WHERE sessionId=$sessionid";
    let order;
    openDatabase();
    db.serialize(function() {
        db.all(retrieveOrderQuery, {$sessionid:currentSession}, (err, result) => {
            if (err) {
                throw new err('could not retrieve cart');
            }
            else {
                res.send(result);
            }
        });
    });
})

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
                console.log(req.session.id);
                req.session.destroy(); //Destroy previous session
                req.session.loggedIn = true; //Create new session to get a new session ID
                req.session.userID = userID; //Link new session to current user
                console.log(req.session.id);
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

module.exports = router;
