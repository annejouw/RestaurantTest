var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var hash = require('object-hash');
var createError = require('http-errors');
var options = {
    secret: "Session has not been compromised.",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
};
var path = require('path');
var morgan = require('morgan');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var app = express();
var passwordRegexp = require('password-regexp')();

//for the menu router
var menuRouter = require('./routers/menurouter.js');
var dishRouter = require('./routers/dishrouter.js');

//The database
var fs = require('fs');
const { resourceLimits } = require('worker_threads');
var databasePath = "database.db";
var exists = fs.existsSync(databasePath);
var db;

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

openDatabase();
db.serialize(function() {
    if (!exists) {
        db.run("CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, streetAddress TEXT NOT NULL, zipCode TEXT NOT NULL, city TEXT NOT NULL, password TEXT NOT NULL)");
        createDefaultUsers();
        db.run("CREATE TABLE Sashimi (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL)");
        createSashimiItems();
        db.run("CREATE TABLE Nigiri (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian TEXT NOT NULL)");
        createNigiriItems();
        db.run("CREATE TABLE Maki (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian TEXT NOT NULL)");
        createMakiItems();
        db.run("CREATE TABLE Desserts (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, allergens TEXT NOT NULL)");
        createDessertItems();
        db.run("CREATE TABLE Drinks (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, volume TEXT NOT NULL, alcoholFree TEXT NOT NULL)");
        createDrinkItems();
    }
    closeDatabase();
});

function createSashimiItems(){
    insertSashimiItem(1, "Sake sashimi", "8.50","images/sashimi-salmon.jpg", 5, "Salmon");
    insertSashimiItem(2, "Maguro sashimi", "8.50", "sashimi-tuna.jpg", 5, "Tuna",);
    insertSashimiItem(3, "Sake and maguro sashimi", "12.50", "salmon-and-tunasashimi.jpg", 8, "Salmon, tuna");
};

function insertSashimiItem(dishID, dishName, price, imageURL, numberOfItems, ingredients){
    const insertStatement = 'INSERT INTO sashimi (dishID, dishName, price, imageURL, numberOfItems, ingredients) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted into the maki table");
    })
};

function createNigiriItems(){
    insertNigiriItem(4, "Sake nigiri", "2.00", "sake.jpg", 2, "Salmon, rice", false);
};

function insertNigiriItem(dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian){
    const insertStatement = 'INSERT INTO Nigiri (dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted into the maki table");
    })
};

function createMakiItems(){

};

function insertMakiItem(dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian){
    const insertStatement = 'INSERT INTO Maki (dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted into the maki table");
    })
};

function createDessertItems(){

};

function insertDessertItem(dishID, dishName, price, imageURL, allergens){
    const insertStatement = 'INSERT INTO Desserts (dishID, dishName, price, imageURL, allergens) VALUES(?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, allergens], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted into the maki table");
    })
};

function createDrinkItems(){

};

function insertDessertItem(dishID, dishName, price, imageURL, volume, alcoholFree){
    const insertStatement = 'INSERT INTO Drinks (dishID, dishName, price, imageURL, volume, alcoholFree) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, allergens], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted into the maki table");
    })
};


//Inserting default users in DB
function createDefaultUsers(){
    db.serialize(function() {
        addUserToDatabase('Annemijn', 'van Koten', 'annemijnvankoten@gmail.com', '0639224616', 'Heemstedelaan 18', '3523KE', 'Utrecht', 'Annemijn1234');
        addUserToDatabase('Martijn', 'Hannosset', 'martijnhannosset@gmail.com', '0640889850', 'Van der Haveweg 128', '4411RB', 'Rilland', 'Martijn1234');
        addUserToDatabase('Jeff', 'Tatum', 'jefftatum@gmail.com', '0694201337', 'Steenhouwer 8', '9502ET', 'Stadskanaal', 'Jeff1234');
        addUserToDatabase('Bas', 'Ret', 'basret@gmail.com', '0622394616', 'Zuidzijde 69', '2411RS', 'Bodegraven', 'BasRet123');
        addUserToDatabase('Fleur', 'van Koten', 'fleurvankoten@gmail.com', '0639546506', 'Paxlaan 15', '2613GC', 'Delft', 'Fleur1234');
    });
}

/*
Middleware
- Logger
- Sessions, cookie, etc.
- Serving static files
- Routers
- Error handlers
*/

//Morgan logger
app.use(morgan('tiny'));

//Session middleware
app.use(session(options));

//Cookie parser middleware
app.use(cookieParser());

//View engine setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Parsing incoming data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routers
app.get('/', (req, res) => {
    res.render('index', { logStatus: req.session.loggedIn });
});

app.get('/index', (req, res) => {
    res.render('index', { logStatus: req.session.loggedIn });
});

app.get('/about', (req, res) => {
    res.render('about', { logStatus: req.session.loggedIn });
});

app.get('/booking', (req, res) => {
    res.render('booking', { logStatus: req.session.loggedIn });
});

app.get('/story', (req, res) => {
    res.render('story', { logStatus: req.session.loggedIn });
});

app.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
    }
    else res.render('login');
});

app.get('/myprofile', (req, res) => {
    if (req.session.loggedIn) {
        res.render('myprofile');
    }
    else res.redirect('/login');
});

//this router handles all menu routing, since special routing is required for the page traversal
app.use('/menu', menuRouter);
app.use('/dish', dishRouter);

//Login information handling
app.post('/login/authenticate', (req, res) => { //still need to sanitize and validate data
    let email = req.body.email;
    let password = req.body.password;
    const prepareQuery = "SELECT userID FROM users WHERE email=? AND password=?";
    if (email && password) {
        db.serialize(function() {
            openDatabase();
            db.get(prepareQuery, [email, hash(password)], (err, result) => {
                console.log("looked up query");
                if (err) {
                    console.log(err.message);
                }
                if (result) {
                    req.session.loggedIn = true;
                    req.session.userID = result.userID;
                    console.log(req.session);
                    res.send({ 'msg': 'success', 'url': '/' })
                    res.end();
                }
                if (typeof result === 'undefined') {
                    console.log("wrong credentials");
                    res.send({ 'msg': 'invalid' });
                    res.end();
                }
            });
            closeDatabase();
        });
    }
    else {
        console.log("empty credentials");
        res.send({ 'msg': 'empty' });
        res.end();
    }
});

//Registering a new user
app.post('/login/register', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = "06" + req.body.phone;
    let password = req.body.password;
    let streetAddress = req.body.streetAddress;
    let zipCode = req.body.zipCode;
    let city = req.body.city;
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    db.serialize(function() {
        openDatabase();
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
            }

            if (result) {
                res.send({ 'msg': 'exists' });
                res.end();
                console.log("user already exists");
            }

            else {
                if (!(passwordRegexp.test(password))) {
                    res.send({ 'msg': 'regexp' });
                    res.end();
                    console.log("password not secure");
                }

                else {
                    addUserToDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, password);
                    req.session.loggedIn = true;
                    req.session.userID = result.userID;
                    console.log(req.session);
                    res.send({ 'msg' : 'success', 'url' : '/' });
                    res.end();
                }
            }
        });
        closeDatabase();
    });
});

function addUserToDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, password) {
    const insertStatement = 'INSERT INTO users(firstName, lastName, email, phone, streetAddress, zipCode, city, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [firstName, lastName, email, phone, streetAddress, zipCode, city, hash(password)], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted");
    })
}

//Retrieve user information for profile page
app.post('/profile/retrieve', (req, res) => {
    let userID = req.session.userID;
    const infoQuery = "SELECT firstName, lastName, email, phone, streetAddress, zipCode, city FROM users WHERE userID=?";
    db.serialize(function() {
        openDatabase();
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
app.post('/profile/editinfo', (req, res) => {
    let userID = req.session.userID;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = "06" + req.body.phone;
    let streetAddress = req.body.streetAddress;
    let zipCode = req.body.zipCode;
    let city = req.body.city;
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    db.serialize(function() {
        openDatabase();
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
            }

            if (result && result.userID !== userID) { //When the email exists in the database but is not the email associated with the currently logged in user
                res.send({ 'msg': 'exists' });
                res.end();
                console.log("user already exists");
            }

            else {
                updateDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, userID);
                res.send({ 'msg':'success' });
                res.end;
            }
        });
        closeDatabase();
    });
});

function updateDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, userID) {
    const updateUser = "UPDATE users SET firstName=?, lastName=?, email=?, phone=?, streetAddress=?, zipCode=?, city=? WHERE id=?";
    db.serialize(function() {
        openDatabase();
        db.run(updateUser, [firstName, lastName, email, phone, streetAddress, zipCode, city, userID], (err) => {
            if (err) {
                console.log(err.message);
            }
        });
    });
}

//Log out
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//Error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.listen(8018);

module.exports = app;