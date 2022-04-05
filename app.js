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

//The database
var fs = require('fs');
const { parse } = require('path');
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
        //table for storing users
        db.run("CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE, password TEXT NOT NULL)");

        //table for storing orders
        db.run("CREATE TABLE orders (orderId INTEGER, sessionId INTEGER NOT NULL, foodItem TEXT NOT NULL, itemCount INTEGER NOT NULL, PRIMARY KEY(orderId, sessionId))");

        //session info table, relates session ID's with ueser ID's when logging im, marks user as anonymous by default
        //db.run("CREATE TABLE sessionInfo (sessionId INT PRIMARY KEY NOT NULL, userId INTEGER, userType TEXT DEFAULT 'anonymous', date DATE DEFAULT GETDATE() )");
        
        //last table which relates orders to users and logs the date
        //db.run("CREATE TABLE orderHistory (userId INTEGER NOT NULL, orderId INTEGER NOT NULL UNIQUE, date DATE DEFAULT GETDATE(), PRIMARY KEY(userId, date) )");
    }
});
closeDatabase();

//function to add default users
let i = 1;
function createDefaultUser(firstName, lastName, email, phone, password) {
    let insertStatement = "INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)";
    db.run(insertStatement, [firstName, lastName, email, phone, password], (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted with userID: " + i);
        i++;
    });
}

//inserting default users in DB
openDatabase();
db.serialize(function() {
    createDefaultUser('Annemijn', 'van Koten', 'annemijnvankoten@gmail.com', '0639224616', '123456');
    createDefaultUser('Martijn', 'Hannosset', 'martijn.hannosset@gmail.com', '0640889850', 'MyNameJeff44');
    createDefaultUser('Jeff', 'Tatum', 'jefftatum@gmail.com', '0694201337', '123456');
    createDefaultUser('Bas', 'Ret', 'basret@gmail.com', '0622394616', '123456');
    createDefaultUser('Fleur', 'van Koten', 'fleurvankoten@gmail.com', '0639546506', '123456');
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

app.get('/menu', (req, res) => {
    res.render('menu', { logStatus: req.session.loggedIn });
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

//cart handling
//app.route('/cart')
let orderId = 1;
app.post( '/cart', (req, res) => {
    //processing post req
    let product = req.body.name;
    let amount = parseInt(req.body.quantity);
    // console.log("=========");
    // console.log(amount);
    // console.log("=========");
    
    //using sessionID to group items of the same order
    var sessiondId = req.session.id;
    console.log(product, amount);

    const checkCart = "SELECT itemCount FROM orders WHERE sessionId=? AND foodItem=?";
    const insertCart = "INSERT INTO orders (sessionId, foodItem, itemCount) VALUES (?, ?, ?)";
    const updateCart = "UPDATE orders (itemCount) VALUES (?) WHERE sessionId=? AND foodItem=?";
    const removeFromCart = "DELETE FROM orders WHERE sessionId=? AND foodItem=?";
    openDatabase();
    db.serialize(function() {
        db.get(checkCart, [sessiondId, product], (err, result) => {
            if (err) {
                db.run(insertCart, [sessiondId, product, amount], (err, result) => {
                    if (err) {
                        console.log(err.message);
                    }
                    if (result) {
                        console.log("Updated " + product + "amount to: " + amount);
                    }
                });
            }
            if (result) {
                // var itemCount = db.get(checkCart, [sessiondId, product]);
                // var itemCountUpdated = itemCount + amount;
                var itemCountUpdated = amount;
                //console.log("original amount: " + itemCount + "new amount: " + itemCountUpdated);
                    if (itemCountUpdated >= 0) {
                        db.run(updateCart, [itemCountUpdated, sessiondId, product], (err, result) => {
                            if (err) {
                                console.log(err.message);
                            }
                            if (result) {
                                console.log("Updated " + product + "amount to: " + itemCountUpdated);
                            }
                        });                       
                    }
                    else {
                        db.run(removeFromCart, [sessiondId, product], (err, result) => {
                            if (err) {
                                console.log(err.message);
                            }
                            if (result) {
                                console.log(err.message);
                            }
                        })
                        // db.run(updateCart, [0, sessiondId, product], (err, result) => {
                        //     if (err) {
                        //         console.log(err.message);
                        //     }
                        //     if (result) {
                        //         console.log("Updated " + product + "amount to: " + 0);
                        //     }
                        //})
                    }
                }
        });
    });
    closeDatabase();
    res.send({ 'msg' : 'success'});
});


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