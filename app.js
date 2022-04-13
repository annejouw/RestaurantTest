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

//routers
var menuRouter = require('./routers/menurouter.js');
var dishRouter = require('./routers/dishrouter.js');
var loginRouter = require('./routers/loginrouter.js');
var profileRouter = require('./routers/profileRouter');
var cartRouter = require('./routers/cartrouter.js');

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
        //Table containing registered users
        db.run("CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, streetAddress TEXT NOT NULL, zipCode TEXT NOT NULL, city TEXT NOT NULL, password TEXT NOT NULL)");
        createDefaultUsers();

        //Tables used for ordering and order history
        db.run("CREATE TABLE orders (sessionId INTEGER NOT NULL, foodItem TEXT NOT NULL, itemCount INTEGER NOT NULL)");
        db.run("CREATE TABLE orderHistory (userId INTEGER NOT NULL, sessionId INTEGER NOT NULL, foodItem TEXT NOT NULL, itemCount INTEGER NOT NULL)");
        createOrderHistory();

        //Tables containing dishes
        db.run("CREATE TABLE Sashimi (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL)");
        createSashimiItems();
        db.run("CREATE TABLE Nigiri (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian INTEGER)");
        createNigiriItems();
        db.run("CREATE TABLE Maki (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian INTEGER)");
        createMakiItems();
        db.run("CREATE TABLE Desserts (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, allergens TEXT NOT NULL)");
        createDessertItems();
        db.run("CREATE TABLE Drinks (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, volume TEXT NOT NULL, alcoholFree INTEGER)");
        createDrinkItems();
    }
    closeDatabase();
});

function createOrderHistory() {
    insertOrderHistory(1, "aaa", "Salmon sashimi", 3);
    insertOrderHistory(1, "aaa", "Tuna sashimi", 1);
    insertOrderHistory(1, "aaa", "Salmon maki", 2);
    insertOrderHistory(1, "bbb", "Salmon sashimi", 3);
    insertOrderHistory(1, "bbb", "Salmon maki", 3);
    insertOrderHistory(1, "ccc", "Tuna sashimi", 2);
}

function insertOrderHistory(userID, sessionID, dishName, itemCount) {
    let insert = "INSERT INTO orderHistory (userId, sessionId, foodItem, itemCount) VALUES(?, ?, ?, ?)";
    db.run(insert, [userID, sessionID, dishName, itemCount], (err) => {
        if (err) {
            console.log(err.message);
        }
    })
}

function createSashimiItems(){
    insertSashimiItem(101, "Sake sashimi", "8.50","images/sashimi-salmon.jpg", 5, "Salmon");
    insertSashimiItem(102, "Maguro sashimi", "8.50", "images/sashimi-tuna.jpg", 5, "Tuna",);
    insertSashimiItem(103, "Sake and maguro sashimi", "12.50", "images/salmon-and-tunasashimi.jpg", 8, "Salmon, tuna");
};

function insertSashimiItem(dishID, dishName, price, imageURL, numberOfItems, ingredients){
    const insertStatement = 'INSERT INTO sashimi (dishID, dishName, price, imageURL, numberOfItems, ingredients) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients], (err) => {
        if (err) {
            console.log(err.message);
        }
    })
};

function createNigiriItems(){
    insertNigiriItem(201, "Sake nigiri", "2.00", "images/sake.jpg", 2, "Salmon, rice", 0);
    insertNigiriItem(202, "Maguro nigiri", "2.00", "images/maguro.jpg", 2, "Tuna, rice", 0);
    insertNigiriItem(203, "Ebi nigiri", "1.80", "images/ebi.jpg", 2, "Shrimp, rice", 0);
    insertNigiriItem(204, "Kani nigiri", "1.60", "images/kani.jpg", 2, "Surimi (crab), rice, seaweed", 0);
    insertNigiriItem(205, "Tamago nigiri", "1.60", "images/tamago-nigiri.jpg", 2, "Tamago (egg omelet), rice, seaweed", 1);
};

function insertNigiriItem(dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian){
    const insertStatement = 'INSERT INTO Nigiri (dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian], (err) => {
        if (err) {
            console.log(err.message);
        }
    })
};

function createMakiItems(){
    insertMakiItem(301, "Kappa maki", "4.50", "images/kappa-maki.jpg", 6, "Cucumber, rice, seaweed", 1);
    insertMakiItem(302, "Sake maki", "5.50", "images/sake-maki.jpg", 6, "Salmon, rice, seaweed", 0);
    insertMakiItem(303, "Tekka maki", "5.50", "images/tekka-maki.jpg", 6, "Tuna, rice, seaweed", 0);
    insertMakiItem(304, "Avocado maki", "4.50", "images/avocado-maki.jpg", 6, "Avocado, rice, seaweed", 1);
};

function insertMakiItem(dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian){
    const insertStatement = 'INSERT INTO Maki (dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, numberOfItems, ingredients, vegetarian], (err) => {
        if (err) {
            console.log(err.message);
        }
    })
};

function createDessertItems(){
    insertDessertItem(401, "Vanilla icecream", "2.50", "images/vanilla-icecream.jpg", "Lactose");
    insertDessertItem(402, "Sesam icecream", "3.00", "images/sesam-icecream.jpg", "Lactose");
    insertDessertItem(403, "Green tea icecream", "3.00", "images/greentea-icecream.jpg", "Lactose");
    insertDessertItem(404, "Assorted fruits", "2.60", "images/fruits.jpg", "Fruit");
};

function insertDessertItem(dishID, dishName, price, imageURL, allergens){
    const insertStatement = 'INSERT INTO Desserts (dishID, dishName, price, imageURL, allergens) VALUES(?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, allergens], (err) => {
        if (err) {
            console.log(err.message);
        }
    })
};

function createDrinkItems(){
    insertDrinkItem(501, "Pepsi", "1.80", "images/cola.jpg", "330 ml", 1);
    insertDrinkItem(502, "Sprite", "1.80", "images/sprite.jpg","330 ml", 1);
    insertDrinkItem(503, "Sake", "5.00","images/sake-drink.jpg", "330 ml", 0);
    insertDrinkItem(504, "Kirin", "3.50", "images/kirin.jpg", "330 ml", 0);
    insertDrinkItem(505, "Sapporo", "3.50", "images/sapporo.jpg","330ml", 0);
};

function insertDrinkItem(dishID, dishName, price, imageURL, volume, alcoholFree){
    const insertStatement = 'INSERT INTO Drinks (dishID, dishName, price, imageURL, volume, alcoholFree) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [dishID, dishName, price, imageURL, volume, alcoholFree], (err) => {
        if (err) {
            console.log(err.message);
        }
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

function addUserToDatabase(firstName, lastName, email, phone, streetAddress, zipCode, city, password) {
    const insertStatement = 'INSERT INTO users(firstName, lastName, email, phone, streetAddress, zipCode, city, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(insertStatement, [firstName, lastName, email, phone, streetAddress, zipCode, city, hash(password)], function (err) {
        if (err) {
            console.log(err.message);
        }
        console.log("A row has been inserted");
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

/*Routers*/
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

//Log out
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//External routers
app.use('/menu', menuRouter);
app.use('/dish', dishRouter);
app.use('/cart', cartRouter);
app.use('/myprofile', profileRouter);
app.use('/login', loginRouter);

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