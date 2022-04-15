Panko Yu restaurant

Group ID: 
  18
Authors:
  Annemijn van Koten, 6525687
  Bas Reterink, 7244118
Direct link to the website:
  http://webtech.science.uu.nl/group18/
Brief explanation of the website:
  We created a website for a sushi restaurant named Panko Yu Sushi. The user can use the website to register, login, order and check and change their personal information.
Structure of the application:
  The main application logic is situated in app.js, which contains logging, session and error middleware, serving static files, rendering views, as well as the (external) routers.
  There are 5 external routers which are included in app.js, stored in the routers folder: 
    - for logging in/registering (loginrouter.js) 
    - for showing the menu dynamically (menurouter.js)
    - for the functioning of the ordering system (cartrouter.js)
    - for the profile and order history page of the user and the editing functionality (profilerouter.js)
    - for the routing to the menu (menurouter.js)
  The static files are situated in the public folder:
    - The images folder contains all images needed for the header, footer, favicon and menu images
    - The javascripts folder contains the client side javascript files
    - The stylesheets folder contains the CSS file for the client side presentation
  The client side javascript files in the javascripts folder are:
    - booking.js: alerts the user that their booking was registered
    - login.js: Handles client side login and registering
    - menu.js: Displaying of the menu page and sending AJAX requests for changing the cart and changing menu category
    - myprofile.js: Profile and order history page handling and info retrieval and editing AJAX requests
  The views (jade files) are situated in the views folder:
    - about.jade: the about page containing contact information
    - booking.jade: table reservation
    - error.jade: error page
    - index.jade: main page
    - login.jade: login and registering page
    - menu.jade: menu page
    - myprofile.jade: profile and order history page
    - story.jade: restaurant background story
Structure of the database:
  The database consists of 8 tables:
    - users: contains information of all registered users (first name, last name, email address, phone number, home address, password(hashed))
    - orders: contains all orders currently in progress or never finished
    - orderHistory: contains all submitted/finalized orders
    - Sashimi: contains all sashimi menu items
    - Nigiri: contains all nigiri menu items
    - Maki: contains all maki menu items
    - Desserts: contains all dessert menu items
    - Drinks: contains all beverage items
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
