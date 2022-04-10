var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var passwordRegexp = require('password-regexp')();
var hash = require('object-hash');

const router = express.Router();
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

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('myprofile');
    }
    else res.redirect('/login');
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
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = "06" + req.body.phone;
    let streetAddress = req.body.streetAddress;
    let zipCode = req.body.zipCode;
    let city = req.body.city;
    console.log(city);
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    openDatabase();
    db.serialize(function() {
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
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

function updateDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, userID) {
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

function updatePassword(userID, newPassword) {
    const updatePassword = "UPDATE users SET password=? WHERE userID=?";
    openDatabase();
    db.serialize(function() {
        db.run(updatePassword, [hash(newPassword), userID], function (err) {
            if (err) {
                console.log(err.message);
            }
            console.log("Changed password");
        });
        closeDatabase();
    });  
}

module.exports = router;