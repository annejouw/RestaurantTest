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
var menuRouter = require('./routers/menurouter.js')

//The database
var fs = require('fs');
const {response} = require("express");
var file = "database.db";
var exists = fs.existsSync(file);
var db;

function openDatabase() {
    db = new sqlite3.Database(file, (err) => {
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
        db.run("CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");
        //session info table, relates session ID's with ueser ID's when logging im, marks user as anonymous by default
        db.run("CREATE TABLE sessionInfo (sessionId INT PRIMARY KEY NOT NULL, userId INTEGER, userType TEXT DEFAULT 'anonymous', date DATE DEFAULT GETDATE() )");
        //table used when logging orders, uses sessionId as the user type (and ID if logged in) will be defined in the sessionInfo table
        db.run("CREATE TABLE orders (orderId INTEGER PRIMARY KEY, sessionId INTEGER NOT NULL, foodItem TEXT NOT NULL, itemCount INTEGER NOT NULL)");
        //last table which relates orders to users and logs the date
        db.run("CREATE TABLE orderHistory (userId INTEGER NOT NULL, orderId INTEGER NOT NULL UNIQUE, date DATE DEFAULT GETDATE(), PRIMARY KEY(userId, date) )");
        //db.run("INSERT INTO users (firstName, lastName, email, phone, password) VALUES ('Annemijn', 'van Koten', 'annemijnvankoten@gmail.com', '0639224616', 'test')")
    }
});
closeDatabase();

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

//Router
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

//Login information handling
app.post('/authenticate', (req, res) => { //still need to sanitize and validate data
    let email = req.body.email;
    let password = hash(req.body.password);
    const prepareQuery = "SELECT userID FROM users WHERE email=? AND password=?";
    if (email && password) {
        db.serialize(function() {
            openDatabase();          
            db.get(prepareQuery, [email, password], (err, result) => {
                console.log("looked up query");
                if (err) {
                    console.log(err.message);
                }
                if (result) {
                    req.session.loggedIn = true;
                    req.session.username = result;
                    console.log(req.session);
                    res.send({ 'msg': 'success', 'url': '/' })
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
app.post('/register', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    const checkEmail = "SELECT userID FROM users WHERE email=?";
    db.serialize(function() {
        openDatabase();
        db.get(checkEmail, [email], (err, result) => {
            if (err) {
                console.log(err.message);
            }
            
            if (result) {
                res.send({ msg: "exists" });
                res.end;
                console.log("user already exists");
            }

            else {
                if (!(passwordRegexp.test(password))) {
                    res.send({ msg: "regexp" });
                    res.end();
                    console.log("password not secure");
                }
                
                else {
                    addToDatabase(firstName, lastName, email, phone, password);
                    req.session.loggedIn = true;
                    req.session.username = result;
                    console.log(req.session);
                    res.redirect('/');
                }
            }
        });
        closeDatabase();
    });
});

function addToDatabase(firstName, lastName, email, phone, password) {
    let insertStatement = 'INSERT INTO users(firstName, lastName, email, phone, password) VALUES(?, ?, ?, ?, ?)';
    db.run(insertStatement, [firstName, lastName, email, phone, hash(password)], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted with userID ${this.lastID}");
    })
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