var express = require('express');
var session = require('express-session');
var options = {
    secret: "Session has not been compromised.",
    resave: false,
    saveUninitialized: true
               };
var path = require('path');
var morgan = require('morgan');
var sqlite3 = require('sqlite3').verbose();
var app = express();

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
        db.run("CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE)");
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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

//Error handling
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/


app.listen(8018);

module.exports = app;