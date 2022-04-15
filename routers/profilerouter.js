/* This file contains the router for all things concerning the profile page and order history page and the '/myprofile' path */

var root = ''; //Local or server root

var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var passwordRegexp = require('password-regexp')(); //Used for password security
var hash = require('object-hash'); //Used to hash passwords for storage
var htmlEncode = require('htmlencode').htmlEncode; //Used to prevent XSS

const router = express.Router();
const databasePath = "database.db"; //Path to database

function openDatabase() { //Opens the connection to the database
    db = new sqlite3.Database(databasePath, (err) => {
        if (err) {
            return console.error(err.message);
        }

        console.log("Connected to the in-memory SQLite database");
    });
}

function closeDatabase() { //Closes the connection to the database
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

router.get('/', (req, res) => { //Check if user is logged in to determine what page the user should be sent to
    if (req.session.loggedIn) {
        res.render('myprofile');
    }
    else res.redirect(root+'/login');
});

//Retrieve user information for profile page
router.get('/retrieve', (req, res) => {
    let userID = req.session.userID;
    const infoQuery = "SELECT firstName, lastName, email, phone, streetAddress, zipCode, city FROM users WHERE userID=?";
    openDatabase();
    db.serialize(function() {
        db.get(infoQuery, [userID], (err, row) => {
            if (err) {
                console.log(err.message);
                throw new Error('Something went wrong with the database');
            }

            if (row) {
                let data = {
                    'msg':'success',
                    'firstName':row.firstName,
                    'lastName':row.lastName,
                    'email':row.email,
                    'phone':row.phone,
                    'streetAddress':row.streetAddress,
                    'zipCode':row.zipCode,
                    'city':row.city
                };
                res.send(data);
            }
        });
        closeDatabase();
    });
});

//Editing user's personal information
router.post('/editinfo', (req, res) => {
    let userID = req.session.userID;
    let firstName = htmlEncode(req.body.firstName);
    let lastName = htmlEncode(req.body.lastName);
    let email = htmlEncode(req.body.email);
    let phone = "06" + req.body.phone;
    let streetAddress = htmlEncode(req.body.streetAddress);
    let zipCode = htmlEncode(req.body.zipCode);
    let city = htmlEncode(req.body.city);
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    openDatabase();
    db.serialize(function() {
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
                throw new Error('Something went wrong with the database');
            }
            
            if (result && result.userID !== userID) { //When the email exists in the database but is not the email associated with the currently logged in user
                res.send({ 'msg': 'exists' });
                console.log("user already exists");
            }

            else {
                updateDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, userID);
                res.send({ 'msg':'success' });
            }
        });
        closeDatabase();
    });    
});

function updateDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, userID) { //Updates database with new user information
    const updateUser = "UPDATE users SET firstName=?, lastName=?, email=?, phone=?, streetAddress=?, zipCode=?, city=? WHERE userID=?";
    openDatabase();
    db.serialize(function() {
        db.run(updateUser, [firstName, lastName, email, phone, streetAddress, zipCode, city, userID], function (err) {
            if (err) {
                console.log(err.message);
            }
        });
        closeDatabase()
    });    
}

//Changing the user's password
router.post('/editpassword', (req, res) => {
    let userID = req.session.userID;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    
    if (!(passwordRegexp.test(newPassword))) {
        res.send({ 'msg': 'regexp' });
        console.log("password not secure");
    }
    else {
        const checkEmail = "SELECT password FROM users WHERE userID=?";
        openDatabase();
        db.serialize(function() {
            db.get(checkEmail, [userID], (err, result) => {
                if (err) {
                    console.log(err.message);
                    throw new Error('Something went wrong with the database');
                }
            
                if (result.password === hash(oldPassword)) { //The passwords match
                    updatePassword(userID, newPassword);
                    res.send({ 'msg':'success'})
                }

                else { //Old password does not match password in database
                    res.send({ 'msg':'noMatch' })
                }
            });
            closeDatabase();
        });
    }    
});

function updatePassword(userID, newPassword) { //Updates the user's password in the database
    const updatePassword = "UPDATE users SET password=? WHERE userID=?";
    openDatabase();
    db.serialize(function() {
        db.run(updatePassword, [hash(newPassword), userID], function (err) {
            if (err) {
                console.log(err.message);
                throw new Error('Something went wrong with the database');
            }
            console.log("Changed password");
        });
        closeDatabase();
    });  
}

//Gets the user's order history
router.get('/orderhistory', (req, res) => {
    let userID = req.session.userID;
    const retrieveOrderHistory = "SELECT orderId, foodItem, price, itemCount FROM orderHistory WHERE userId = ?";
    openDatabase();
    db.serialize(function() {
        db.all(retrieveOrderHistory, [userID], function (err, rows) {
            if (err) {
                console.log(err.message);
                throw new Error('Something went wrong with the database');
            }
            let orderHistoryJSON = JSON.stringify(rows);
            res.send(orderHistoryJSON);
        });
        closeDatabase();
    });
});

module.exports = router;
