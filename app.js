var express = require('express');
var session = require('express-session');
var createError = require('http-errors');
var options = {
    secret: "Session has not been compromised.",
    resave: false,
    saveUninitialized: true
               };
var path = require('path');
var morgan = require('morgan');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var app = express();
var passwordRegexp = require('password-regexp');
var customRegexp = passwordRegexp({
    min: 8,
    max: 32,
    numeric: true,
    uppercase: true,
    symbols: true
});

//The database
var fs = require('fs');
var file = "database.db";
var exists = fs.existsSync(file);

var db = new sqlite3.Database(file, (err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log("Connected to the in-memory SQLite database");
});

db.serialize(function() {
    if (!exists) {
        db.run("CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");
    }
})

db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

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

//Session
app.use(session(options));

//View engine setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

//Serving static files
// app.use(express.json()); Not sure when this is needed yet
app.use(express.static(path.join(__dirname, 'public')));

//Parsing post body
app.use(bodyParser.urlencoded({ extended: false }));

//Router
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/booking', (req, res) => {
    res.render('booking');
});

app.get('/menu', (req, res) => {
    res.render('menu');
});

app.get('/story', (req, res) => {
    res.render('story');
});

app.get('/login', (req, res) => {
    res.render('login');
});

//Login information handling
app.post('/authenticate', (req, res) => { //still need to sanitize and validate data
    let email = req.body.email;
    let password = req.body.password;
    const prepareQuery = "SELECT * FROM users WHERE email = ? AND password = ?"
    console.log("prepared query");
    if (email && password) {
        db.run(prepareQuery, [email, password], (err, results) => {
            console.log("looked up query");
            if (err) throw error;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/index');
            }
            else {
                res.send('Incorrect email address and/or password.');
            }
            res.end();
        });
        db.close();
    }
    else {
        res.send('Please enter email address and password.');
        res.end();
    }
    res.redirect('/index');
    res.end();
});

//Registering a new user
app.post('/register', (req, res) => { //still need to sanitize and validate data
    console.log("trying to register new user");
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    if (customRegexp.test(password)) {
        let insertStatement = 'INSERT INTO users(firstName, lastName, email, phone, password) VALUES(?)';
        db.run(insertStatement, [firstName, lastName, email, phone, password], (err) => {
            if (err) throw error;
            console.log("A row has been inserted with userID " + this.lastID);
        })
        db.close();
    }
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