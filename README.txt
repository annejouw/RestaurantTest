Panko Yu restaurant

Group ID: 
  18
Authors:
  Annemijn van Koten, 6525687
  Bas Reterink, 7244118
  (Martijn Hannosset, 6486371)
Direct link to the website:
  http://webtech.science.uu.nl/group18/
Brief explanation of the website:
  .
Logins and passwords of all registered users:
  Name, login (email address), password
  Annemijn van Koten, annemijnvankoten@gmail.com, Annemijn1234
  Martijn Hannosset, martijnhannosset@gmail.com, Martijn1234
  Jeff Tatum, jefftatum@gmail.com, Jeff1234
  Bas Ret, basret@gmail.com, BasRet123
  Fleur van Koten, fleurvankoten@gmail.com, Fleur1234
SQL definition of the database:
  Table containing registered users: 
    CREATE TABLE users (userID INTEGER PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL, streetAddress TEXT NOT NULL, zipCode TEXT NOT NULL, city TEXT NOT NULL, password TEXT NOT NULL)
  Table for current orders: 
    CREATE TABLE orders (orderId INTEGER NOT NULL, foodItem TEXT NOT NULL, price TEXT NOT NULL, itemCount INTEGER NOT NULL)
  Table for order history: 
    CREATE TABLE orderHistory (userId INTEGER NOT NULL, orderId INTEGER NOT NULL, foodItem TEXT NOT NULL, price REAL NOT NULL, itemCount INTEGER NOT NULL)
  Tables containing menu dishes:
    CREATE TABLE Sashimi (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL)
    CREATE TABLE Nigiri (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian INTEGER)
    CREATE TABLE Maki (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, numberOfItems TEXT NOT NULL, ingredients TEXT NOT NULL, vegetarian INTEGER)
    CREATE TABLE Desserts (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, allergens TEXT NOT NULL)
    CREATE TABLE Drinks (dishID INTEGER PRIMARY KEY, dishName TEXT NOT NULL, price TEXT NOT NULL, imageURL TEXT NOT NULL, volume TEXT NOT NULL, alcoholFree INTEGER)
