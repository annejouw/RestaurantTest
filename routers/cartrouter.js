const express = require('express');
const router = express.Router();
const uuid = require('uuid');

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
    let currentOrder = req.session.orderID;
    let dishName = req.body.dishname;

    console.log('item: ' + dishName + ' orderid: ' + currentOrder)

    if (req.session.loggedIn) {
        if (selectedChange === 'increase' || selectedChange === 'decrease'){
            changeItemAmount(currentOrder, dishName, selectedChange);
            res.sendStatus(200);
        }
        else throw new Error('unexpected change received in cart');
        } else {
        res.status(400).send("Can't order items, you are not logged in");
    }

    //user not logged in

});
/*
first, check if dish exists in the order for this orderID.
If the dish doesn't exist and user wants to increase, create it.

If the dish does exist, check if user wants to increase or decrease

for increase, increase itemCount by 1 for this item

for decrease, check if itemCount is one or less.
If itemcount<=1, delete it
If itemcount>1, decrease itemCount by one
*/
async function changeItemAmount(currentOrder, dishName, selectedChange){
    openDatabase();
    db.serialize(function (){
        const checkCartQuery = "SELECT itemCount FROM orders WHERE orderId=$toCheckId AND foodItem=$toCheckItem";
        db.get(checkCartQuery, {
            $toCheckItem : dishName,
            $toCheckId : currentOrder
        }, (err, result) => {
            if (err) {
                console.log(err.message);
            }
            if (!result) {
                if (selectedChange === 'increase'){
                    addDishToOrder(currentOrder, dishName)
                }
                //if the item doesn't exist, but user wants to decrease, do nothing
            }
            else {
                oldAmount = result.itemCount;
                if (selectedChange === 'increase') {
                    let newAmount = oldAmount + 1;
                    const ItemCountQuery = "UPDATE orders SET itemCount = $newamount WHERE orderId = $orderid AND foodItem = $fooditem"
                    openDatabase();
                    db.serialize( function() {
                        db.run(ItemCountQuery, {
                            $orderid:currentOrder,
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
                        const ItemCountQuery = "UPDATE orders SET itemCount = $newamount WHERE orderId = $orderid AND foodItem = $fooditem"
                        openDatabase();
                        db.serialize(function() {
                            db.run(ItemCountQuery, {
                                $orderid:currentOrder,
                                $fooditem:dishName,
                                $newamount:newAmount,
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
                        const deleteQuery = "DELETE FROM orders where orderId = $orderid AND foodItem = $fooditem";
                        openDatabase()
                        db.serialize(function() {
                            db.run(deleteQuery, {
                                $orderid:currentOrder,
                                $fooditem:dishName,
                            })
                        });
                    }
                }
            }
        });
        closeDatabase();
    });
}

//adds a dish to an order if it doesn't exist yet
function addDishToOrder(currentOrder, dishName){
    const insertDishQuery = "INSERT INTO orders (orderId, foodItem, price, itemCount) VALUES ($orderid, $fooditem, $price, $itemcount)";
    openDatabase();
    db.serialize( function() {
        db.run(insertDishQuery, {
            $orderid:currentOrder,
            $fooditem:dishName,
            $itemcount:1,
            $price:dict[dishName]
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
    let currentOrder = req.session.orderID;
    const retrieveOrderQuery = "SELECT foodItem, price, itemCount FROM orders WHERE orderId=$orderid";
    openDatabase();
    db.serialize(function() {
        db.all(retrieveOrderQuery, {$orderid:currentOrder}, (err, result) => {
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
    let orderID = req.session.orderID;

    let currentOrderStatement = "SELECT foodItem, itemCount, price FROM orders WHERE orderId = ?";
    openDatabase();
    db.serialize(function() {
        db.all(currentOrderStatement, [orderID], (err, rows) => {
            if (err) {
                console.log(err.message);
            }

            if (rows) {
                console.log(rows);
                rows.forEach(row => addToOrderHistory(userID, orderID, row));
                let deleteStatement = "DELETE FROM orders WHERE orderId = ?";
                db.run(deleteStatement, [orderID], (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                });
                console.log(req.session.orderID);
                req.session.orderID = uuid.v4();
                console.log(req.session.orderID);
                res.send({ 'msg':'success'});
            }

            else {
                res.send({ 'msg':'empty' });
            }
        });
        //closeDatabase();
    });
});

function addToOrderHistory (userID, orderID, row) {
    let insertStatement = "INSERT INTO orderHistory (userId, orderId, foodItem, price, itemCount) VALUES (?, ?, ?, ?, ?)";
    db.run(insertStatement, [userID, orderID, row.foodItem, row.price, row.itemCount], (err) => {
        if (err) {
            console.log(err.message);
        }
    });
}

let dict = {
    "Sake sashimi":8.50,
    "Maguro sashimi":8.50,
    "Sake and maguro sashimi":12.50,
    "Sake nigiri":2.00,
    "Maguro nigiri":2.00,
    "Ebi nigiri":1.80,
    "Kani nigiri":1.60,
    "Tamago nigiri":1.60,
    "Kappa maki":4.50,
    "Sake maki":5.50,
    "Tekka maki":5.50,
    "Avocado maki":4.50,
    "Vanilla icecream":2.50,
    "Sesam icecream":3.00,
    "Green tea icecream":3.00,
    "Assorted fruits":2.60,
    "Pepsi":1.80,
    "Sprite":1.80,
    "Sake":5.00,
    "Kirin":3.50,
    "Sapporo":3.50
}

module.exports = router;
