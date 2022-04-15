var express = require('express');
const hash = require("object-hash");
var sqlite3 = require('sqlite3').verbose();
var passwordRegexp = require('password-regexp')();
const uuid = require('uuid');
var htmlEncode = require('htmlencode').htmlEncode;

const router = express.Router();
const databasePath = "database.db";

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

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/index');
    }
    else res.render('login');
});

//Login information handling
router.post('/authenticate', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    const prepareQuery = "SELECT userID FROM users WHERE email=? AND password=?";
    if (email && password) {
        openDatabase();
        db.serialize(function() {
            db.get(prepareQuery, [email, hash(password)], (err, result) => {
                console.log("looked up query");
                if (err) {
                    console.log(err.message);
                }
                if (result) {
                    req.session.loggedIn = true;
                    req.session.userID = result.userID;
                    req.session.orderID = uuid.v4();
                    res.send({ 'msg': 'success', 'url': '/' })
                }
                if (typeof result === 'undefined') {
                    res.send({ 'msg': 'invalid' });
                }
            });
            closeDatabase();
        });
    }
    else {
        res.send({ 'msg': 'empty' });
    }
});

//Registering a new user
router.post('/register', (req, res) => {
    let firstName = htmlEncode(req.body.firstName);
    let lastName = htmlEncode(req.body.lastName);
    let email = htmlEncode(req.body.email); 
    let phone = "06" + req.body.phone; //The html form specifies this must be a sequence of 8 number -> No need to encode
    let password = req.body.password;
    let streetAddress = htmlEncode(req.body.streetAddress);
    let zipCode = htmlEncode(req.body.zipCode);
    let city = htmlEncode(req.body.city);
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    openDatabase();
    db.serialize(function() {
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
            }

            if (result) {
                res.send({ 'msg': 'exists' });
            }

            else {
                if (!(passwordRegexp.test(password))) {
                    res.send({ 'msg': 'regexp' });
                }

                else {
                    openDatabase();
                    const insertStatement = 'INSERT INTO users(firstName, lastName, email, phone, streetAddress, zipCode, city, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
                    db.run(insertStatement, [firstName, lastName, email, phone, streetAddress, zipCode, city, hash(password)], function (err) {
                        if (err) {
                            console.log(err.message);
                        }
                        let userID = this.lastID;
                        req.session.loggedIn = true;
                        req.session.userID = userID;
                        req.session.orderID = uuid.v4();
                        res.send({ 'msg' : 'success', 'url' : '/' });
                    });
                }
            }
        });
        closeDatabase();
    });
});

module.exports = router;
