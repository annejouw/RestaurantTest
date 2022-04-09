//const { post, response } = require("../../app");

//const { strict } = require("jade/lib/doctypes");

//Menu item classes
class Menu {
    constructor (categories) {
        this.categories = categories; //array of objects of the type Category
    }
}

class Menusection {
    constructor (name, foodItems) {
        this.name = name; //string
        this.foodItems = foodItems; //array of objects of the type Food
    }
}

class Food { 
    constructor (name, price, imageLocation, quantity) {
        this.name = name; //string
        this.price = price; //double
        this.imageLocation = imageLocation; //string
        this.quantity = quantity; //int
    }
}

class Sushi extends Food {
    constructor (name, price, imageLocation, numberOfItems, ingredients, quantity) {
        super (name, price, imageLocation, quantity);
        this.numberOfItems = numberOfItems; //int
        this.ingredients = ingredients; //string
    }
}

class Sashimi extends Sushi {
    constructor (name, price, imageLocation, numberOfItems, ingredients, quantity) {
        super (name, price, imageLocation, numberOfItems, ingredients, quantity);
    }
}

class Nigiri extends Sushi {
    constructor (name, price, imageLocation, numberOfItems, ingredients, vegetarian, quantity) {
        super (name, price, imageLocation, numberOfItems, ingredients, quantity);
        this.vegetarian = vegetarian; //bool
    }
}

class Maki extends Sushi {
    constructor (name, price, imageLocation, numberOfItems, ingredients, vegetarian, quantity) {
        super (name, price, imageLocation, numberOfItems, ingredients, quantity);
        this.vegetarian = vegetarian; //bool
    }
}

class Desserts extends Food {
    constructor (name, price, imageLocation, allergens, quantity) {
        super (name, price, imageLocation, quantity);
        this.allergens = allergens //string
    }
}

class Drinks extends Food {
    constructor (name, price, imageLocation, volume, alcoholFree, quantity) {
        super (name, price, imageLocation, quantity);
        this.volume = volume; //string
        this.alcoholFree = alcoholFree //bool
    }
}

//Sashimi objects
let salmonSashimi = new Sashimi("Sake sashimi", "8.50", "sashimi-salmon.jpg", 5, "Salmon", 0);
let tunaSashimi = new Sashimi("Maguro sashimi", "8.50", "sashimi-tuna.jpg", 5, "Tuna", 0);
let salmonTunaSashimi = new Sashimi("Sake and maguro sashimi", "12.50", "salmon-and-tunasashimi.jpg", 8, "Salmon, tuna", 0);

let sashimiMenuSection = new Menusection("Sashimi", [salmonSashimi, tunaSashimi, salmonTunaSashimi]); 

//Nigiri objects
let salmonNigiri = new Nigiri("Sake nigiri", "2.00", "sake.jpg", 2, "Salmon, rice", false, 0);
let tunaNigiri = new Nigiri("Maguro nigiri", "2.00", "maguro.jpg", 2, "Tuna, rice", false, 0);
let shrimpNigiri = new Nigiri("Ebi nigiri", "1.80", "ebi.jpg", 2, "Shrimp, rice", false, 0);
let crabNigiri = new Nigiri("Kani nigiri", "1.60", "kani.jpg", 2, "Surimi (crab), rice, seaweed", false, 0);
let eggNigiri = new Nigiri("Tamago nigiri", "1.60", "tamago-nigiri.jpg", 2, "Tamago (egg omelet), rice, seaweed", true, 0);

let nigiriMenuSection = new Menusection("Nigiri", [salmonNigiri, tunaNigiri, shrimpNigiri, crabNigiri, eggNigiri]);

//Maki objects
let kappaMaki = new Maki("Kappa maki", "4.50", "kappa-maki.jpg", 6, "Cucumber, rice, seaweed", true, 0);
let sakeMaki = new Maki("Sake maki", "5.50", "sake-maki.jpg", 6, "Salmon, rice, seaweed", false, 0);
let tekkaMaki = new Maki("Tekka maki", "5.50", "tekka-maki.jpg", 6, "Tuna, rice, seaweed", false, 0);
let avocadoMaki = new Maki("Avocado maki", "4.50", "avocado-maki.jpg", 6, "Avocado, rice, seaweed", true, 0);

let makiMenuSection = new Menusection("Maki", [kappaMaki, sakeMaki, tekkaMaki, avocadoMaki]);

//Dessert objects
let vanillaIcecream = new Desserts("Vanilla icecream", "2.50", "vanilla-icecream.jpg", "Lactose", 0);
let sesamIcecream = new Desserts("Sesam icecream", "3.00", "sesam-icecream.jpg", "Lactose", 0);
let greenTeaIcecream = new Desserts("Green tea icecream", "3.00", "greentea-icecream.jpg", "Lactose", 0);
let assortedFruits = new Desserts("Assorted fruits", "2.60", "fruits.jpg", "")

let dessertMenuSection = new Menusection("Desserts", [vanillaIcecream, sesamIcecream, greenTeaIcecream, assortedFruits]);

//Drink objects
let pepsi = new Drinks("Pepsi", "1.80", "cola.jpg", "330 ml", true, 0);
let sprite = new Drinks("Sprite", "1.80", "sprite.jpg","330 ml", true, 0);
let sake = new Drinks("Sake", "5.00","sake-drink.jpg", "330 ml", false, 0);
let kirin = new Drinks("Kirin", "3.50", "kirin.jpg", "330 ml", false, 0);
let sapporo = new Drinks("Sapporo", "3.50", "sapporo.jpg","330ml", false, 0);

let drinksMenuSection = new Menusection("Drinks", [pepsi, sprite, sake, kirin, sapporo]);

//Menu
let fullMenu = new Menu([sashimiMenuSection, nigiriMenuSection, makiMenuSection, dessertMenuSection, drinksMenuSection]);

//Menu dictionary used for the cart
let dict = new Object();
for (let menuSection of fullMenu.categories) {
    for (let menuItem of menuSection.foodItems) {
        createDictionaryEntry(menuItem);
    }
}

function createDictionaryEntry (productObject) {
    dict[productObject.name + " quantity"] = productObject;
}

//-----------------------------------------------------------------

//Creating cart contents
let cart = new Map();
updateCart();

function updateCart() {
    cart.clear(); //Clear map to remove all key item pairs. Makes sure items with quantity 0 are not present/removed from the map
    for (let menuSection of fullMenu.categories) {
        for (let menuItem of menuSection.foodItems) {
            addToCart(menuItem);
        }
    }
}

function addToCart(productObject) {
    if (productObject.quantity) {
        cart.set(productObject.name, productObject.quantity);
    }
}

//-----------------------------------------------------------------
  
//Functions needed to create the webpage layout
function createLinkBoxLink(name, link) {
    let linkAnchor = document.createElement('a');
    let linkText = document.createTextNode(name);
    linkAnchor.setAttribute('href', link);
    linkAnchor.appendChild(linkText);
    linkAnchor.classList.add("menu__link")

    menuLinkBox.appendChild(linkAnchor);
}

function createCategory(name, id) {
    let categoryHeading = document.createElement('h2');
    let categoryText = document.createTextNode(name);
    categoryHeading.classList.add("menu__category-header")
    categoryHeading.appendChild(categoryText);
    categoryHeading.id = id;
    
    menuPageMain.appendChild(categoryHeading);
}

function createProductGrid() {
    let flexDiv = document.createElement('div');
    flexDiv.classList.add("category-container");

    let gridDiv = document.createElement('div');
    gridDiv.classList.add("category-container__category-grid");
    flexDiv.appendChild(gridDiv);

    menuPageMain.appendChild(flexDiv);

    return gridDiv;
}

function createSashimiGrid(gridDiv) {
    let i = 0;
    while (sashimiMenuSection.foodItems[i]) {
        let sashimiObject = sashimiMenuSection.foodItems[i];
        
        //Creating product container
        let productDisplay = document.createElement('article');
        productDisplay.classList.add("category-grid__product");
        
        //Adding product heading
        let productHeading = createProductHeaderPCS(sashimiObject);
        productDisplay.appendChild(productHeading);

        //Adding product information and image
        let productDiv = document.createElement('div');
        productDiv.classList.add("product__description");
        
        let productImage = createProductImage(sashimiObject);
        productDiv.appendChild(productImage);

        let productDesc = document.createElement('div');

        let productIngr = document.createElement('p');
        let productIngrText = document.createTextNode("Ingredients: " + sashimiObject.ingredients);
        productIngr.appendChild(productIngrText);
        productDesc.appendChild(productIngr);

        let productPrice = createProductPrice(sashimiObject)
        productDesc.appendChild(productPrice);

        productDiv.appendChild(productDesc);
        productDisplay.appendChild(productDiv);

        //Adding item manipulation
        let incrementer = createQuantityIncrementer(sashimiObject);
        productDisplay.appendChild(incrementer);

        gridDiv.appendChild(productDisplay);

        i++;
    }
}

function createNigiriOrMakiGrid(gridDiv, productObjects) {
    let i = 0;
    while (productObjects.foodItems[i]) {
        let productObject = productObjects.foodItems[i];
        
        //Creating product container
        let productDisplay = document.createElement('article');
        productDisplay.classList.add("category-grid__product");
        
        //Adding product heading
        let productHeading = createProductHeaderPCS(productObject);
        productDisplay.appendChild(productHeading);

        //Adding product information and image
        let productDiv = document.createElement('div');
        productDiv.classList.add("product__description");

        let productImage = createProductImage(productObject);
        productDiv.appendChild(productImage);

        let productDesc = document.createElement('div');

        let productIngr = document.createElement('p');
        let productIngrText = document.createTextNode("Ingredients: " + productObject.ingredients);
        productIngr.appendChild(productIngrText);
        productDesc.appendChild(productIngr);

        if (productObject.vegetarian) {
            let vegetarian = document.createElement('p');
            let vegetarianText = document.createTextNode("Vegetarian");
            vegetarian.appendChild(vegetarianText);
            productDesc.appendChild(vegetarian);
        }

        let productPrice = createProductPrice(productObject);
        productDesc.appendChild(productPrice);

        productDiv.appendChild(productDesc);
        productDisplay.appendChild(productDiv);

        //Adding item manipulation
        let incrementer = createQuantityIncrementer(productObject);
        productDisplay.appendChild(incrementer);

        gridDiv.appendChild(productDisplay);

        i++;
    }
}

function createDessertsGrid(gridDiv) {
    let i = 0;
    while (dessertMenuSection.foodItems[i]) {
        let dessertObject = dessertMenuSection.foodItems[i];
        
        //Creating product container
        let productDisplay = document.createElement('article');
        productDisplay.classList.add("category-grid__product");
        
        //Adding product heading
        let productHeading = createProductHeader(dessertObject);
        productDisplay.appendChild(productHeading);

        //Adding product information and image
        let productDiv = document.createElement('div');
        productDiv.classList.add("product__description");
        
        let productImage = createProductImage(dessertObject);
        productDiv.appendChild(productImage);

        let productDesc = document.createElement('div');

        if (dessertObject.allergens) {
            let productAllergen = document.createElement('p');
            let productAllergenText = document.createTextNode("Allergens: " + dessertObject.allergens);
            productAllergen.appendChild(productAllergenText);
            productDesc.appendChild(productAllergen);
        }
        
        let productPrice = createProductPrice(dessertObject);
        productDesc.appendChild(productPrice);

        productDiv.appendChild(productDesc);
        productDisplay.appendChild(productDiv);

        //Adding item manipulation
        let incrementer = createQuantityIncrementer(dessertObject);
        productDisplay.appendChild(incrementer);

        gridDiv.appendChild(productDisplay);

        i++;
    }
}

function createDrinksGrid(gridDiv) {
    let i = 0;
    while (drinksMenuSection.foodItems[i]) {
        let drinksObject = drinksMenuSection.foodItems[i];
        
        //Creating product container
        let productDisplay = document.createElement('article');
        productDisplay.classList.add("category-grid__product");
        
        //Adding product heading
        let productHeading = createProductHeader(drinksObject);
        productDisplay.appendChild(productHeading);

        //Adding product information and image
        let productDiv = document.createElement('div');
        productDiv.classList.add("product__description");

        let productImage = createProductImage(drinksObject);
        productDiv.appendChild(productImage);

        let productDesc = document.createElement('div');

        let productVolume = document.createElement('p');
        let productVolumeText = document.createTextNode("Volume: " + drinksObject.volume);
        productVolume.appendChild(productVolumeText);
        productDesc.appendChild(productVolume);       

        if (!drinksObject.alcoholFree) {
            let alcoholIndicator = document.createElement('p');
            let alcoholText = document.createTextNode("Contains alcohol, 18+");
            alcoholIndicator.appendChild(alcoholText);
            productDesc.appendChild(alcoholIndicator);
        }

        let productPrice = createProductPrice(drinksObject);
        productDesc.appendChild(productPrice);

        productDiv.appendChild(productDesc);
        productDisplay.appendChild(productDiv);

        //Adding item manipulation
        let incrementer = createQuantityIncrementer(drinksObject);
        productDisplay.appendChild(incrementer);

        gridDiv.appendChild(productDisplay);

        i++;
    }
}

function createProductHeaderPCS(productObject) {
    let productHeading = document.createElement('h1');
    let productHeadingText = document.createTextNode(productObject.name + itemNumberString(productObject.numberOfItems));
    productHeading.classList.add("product__header")
    productHeading.appendChild(productHeadingText);
    return productHeading;
}

function createProductHeader(productObject) {
    let productHeading = document.createElement('h1');
    let productHeadingText = document.createTextNode(productObject.name);
    productHeading.classList.add("product__header")
    productHeading.appendChild(productHeadingText);
    return productHeading;
}

function itemNumberString(numberOfItems) {
    return " (" + numberOfItems + " PCS)";
}

function imageSource(image) {
    return "/images/" + image;
}

function createProductImage(productObject) {
    let productImage = document.createElement('img');
    productImage.setAttribute("src", imageSource(productObject.imageLocation));
    productImage.setAttribute("alt", productObject.name);
    productImage.classList.add("product__image");
    return productImage;
}

function createProductPrice(productObject) {
    let productPrice = document.createElement('p');
    let productPriceText = document.createTextNode("Price: €" + productObject.price);
    productPrice.appendChild(productPriceText);
    return productPrice;
}

function createQuantityIncrementer(productObject) {
    let incrementerDiv = document.createElement('div');
    incrementerDiv.classList.add("product__incrementer");

    let minusButton = document.createElement('button');
    let minusButtonText = document.createTextNode("-");
    minusButton.setAttribute("type", "button");
    minusButton.setAttribute("name", productObject.name + " decrease");
    minusButton.classList.add("product__incrementer--minus");
    minusButton.appendChild(minusButtonText);
    minusButton.addEventListener("click", decrease, false);
    
    let quantityInput = document.createElement('input');
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("name", productObject.name + " quantity");
    quantityInput.setAttribute("value", "0");
    quantityInput.setAttribute("min", "0");
    quantityInput.classList.add("product__quantity");
    quantityInput.addEventListener("change", inputFieldChange, false);
    
    let plusButton = document.createElement('button');
    let plusButtonText = document.createTextNode("+");
    plusButton.setAttribute("type", "button");
    plusButton.setAttribute("name", productObject.name + " increase");
    plusButton.classList.add("product__incrementer--plus");
    plusButton.appendChild(plusButtonText);
    plusButton.addEventListener("click", increase, false);

    incrementerDiv.appendChild(minusButton);
    incrementerDiv.appendChild(quantityInput);
    incrementerDiv.appendChild(plusButton);

    return incrementerDiv;
}

//Events
function decrease(e) {
    let inputField = e.target.parentElement.children[1];
    if (parseInt(inputField.value) != 0) {
        inputField.value = parseInt(inputField.value) - 1;
    }
    else {
        inputField.value = 0;
    }
    updateServerCart(inputField.name, inputField.value);  
}

function increase(e) {
    let inputField = e.target.parentElement.children[1];
    inputField.value = parseInt(inputField.value) + 1;
    updateServerCart(inputField.name, inputField.value);
}

function inputFieldChange(e) {
    let value = parseInt(e.target.value);
    let name = e.target.name;
    if (!(value >= 0) || isNaN(value) || value == -0) {
        e.target.value = 0;
    }
    updateServerCart(name, e.target.value);
}

function changeProductQuantity(name, value) {
    let productObject = dict[name];
    productObject.quantity = parseInt(value);
    updateCart(); //wipes cart and retrieves input field values
    drawCart(); //visually adds to cart

    console.log(productObject.name + " : " + productObject.quantity);
}

//Creating the actual webpage
let menuPageMain = document.createElement('article');
menuPageMain.classList.add("menu");

let menuHeading = document.createElement('h1');
let menuHeadingText = document.createTextNode('Our menu');
menuHeading.classList.add("menu__header")
menuHeading.appendChild(menuHeadingText);
menuPageMain.appendChild(menuHeading);

let menuLinkBox = document.createElement('p');
menuLinkBox.classList.add("menu__menu-links");

createLinkBoxLink("Sashimi", "#sashimi-anchor");
createLinkBoxLink("Nigiri", "#nigiri-anchor");
createLinkBoxLink("Maki", "#maki-anchor");
createLinkBoxLink("Desserts", "#desserts-anchor");
createLinkBoxLink("Drinks", "#drinks-anchor");
menuPageMain.appendChild(menuLinkBox);

createCategory("Sashimi", "sashimi-anchor");
//Add Sashimi menu elements
let sashimiGridDiv = createProductGrid();
createSashimiGrid(sashimiGridDiv);

createCategory("Nigiri", "nigiri-anchor");
//Add Nigiri menu elements
let nigiriGridDiv = createProductGrid();
createNigiriOrMakiGrid(nigiriGridDiv, nigiriMenuSection);

createCategory("Maki", "maki-anchor");
//Add Maki menu elements
let makiGridDiv = createProductGrid();
createNigiriOrMakiGrid(makiGridDiv, makiMenuSection);

createCategory("Desserts", "desserts-anchor");
//Add Dessert menu elements
let dessertsGridDiv = createProductGrid();
createDessertsGrid(dessertsGridDiv);

createCategory("Drinks", "drinks-anchor");
//Add Drinks menu elements
let drinksGridDiv = createProductGrid();
createDrinksGrid(drinksGridDiv);

let cartHeading = document.createElement('h1');
let cartHeadingText = document.createTextNode('Your cart');
cartHeading.classList.add("menu__header");
cartHeading.appendChild(cartHeadingText);
menuPageMain.appendChild(cartHeading);

let cartItems = document.createElement('div');
let emptyCart = document.createElement('p');
let emptyCartText = document.createTextNode('Your cart is empty');
cartItems.classList.add("menu__cart");
cartItems.addEventListener("onload", retrieveServerCart, false);
emptyCart.appendChild(emptyCartText);
cartItems.appendChild(emptyCart);
menuPageMain.appendChild(cartItems);

let submitButton = createSubmit();
menuPageMain.appendChild(submitButton);

let contentDivMenu = document.querySelector('#menu-content');
contentDivMenu.appendChild(menuPageMain);

//Cart functionality
function drawCart() {
    let cartItems = document.querySelector('.menu__cart');
    deleteChildNodes(cartItems); //Remove all items from cart

    if (!cart.size) { //When cart is empty
        cartItems.appendChild(emptyCart); //emptyCart already exists outside the function
    }

    else { //When cart is not empty
        addItemsToCart(cartItems);
        
        //total price section
        let cartPrice = document.createElement('p');
        let cartPriceText = document.createElement('strong');
        let cartPriceTextTotal = document.createTextNode('Total price:');
        cartPriceText.appendChild(cartPriceTextTotal);
        let cartPriceTotal = document.createTextNode(' €' + totalPrice().toFixed(2));
        cartPrice.appendChild(cartPriceText);
        cartPrice.appendChild(cartPriceTotal);
        cartItems.appendChild(cartPrice);
    }

    let productFields = document.querySelectorAll(".category-grid__product");
    for (let productField of productFields) {
        let inputField = productField.children[2].children[1];
        if (parseInt(inputField.value) > 0) {
            productField.classList.add("category-grid__product--selected");
        }
        
        else {
            productField.classList.remove("category-grid__product--selected");
        }
    }
}

function totalPrice() {
    let price = 0;
    for (let menuSection of fullMenu.categories) {
        for (let menuItem of menuSection.foodItems) {
            if (menuItem.quantity) {
                price += (parseFloat(menuItem.quantity) * parseFloat(menuItem.price));
            }
        }
    }
    return price;
}

function deleteChildNodes(cartItems) {
    let child = cartItems.lastElementChild;
    while(child) {
        cartItems.removeChild(child);
        child = cartItems.lastElementChild;
    }
}

function addItemsToCart(cartItems) {
    for (let menuSection of fullMenu.categories) {
        for (let menuItem of menuSection.foodItems) {
            if (menuItem.quantity) {
                let cartItem = document.createElement('p');
                let cartItemText = document.createTextNode(menuItem.quantity + "x " + menuItem.name);
                cartItem.appendChild(cartItemText);
                cartItems.appendChild(cartItem);
            }
        }
    }
}

function createSubmit() {
    let submitButton = document.createElement('button');
    let submitText = document.createTextNode('Submit your order');
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "submit-button");
    submitButton.classList.add("menu__submit");
    submitButton.appendChild(submitText);
    submitButton.addEventListener("click", orderCheck, false);
    return submitButton;
}

//AJAX post request for updating cart in DB
function updateServerCart (name, value) {
    var str = name.substring(0, name.lastIndexOf(' '));
    var data = { 'name' : str,
                 'quantity' : value}    
    $.ajax({
        url:'/cart/update',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response){
            if (response.msg == 'success') {
            changeProductQuantity(name, value);    
            }
            if (response.msg == 'notLoggedIn') {
                alert("Cannot add item to cart, user not logged in.");
                clearCart();
            }
        },
        error:function(){
            console.log("Could not update cart with server");
        }
    });
}

//AJAX get request to retrieve existing cart from db if possible
function retrieveServerCart() {
    console.log("attempting to retrieve cart from server");
    $.ajax({
        url:'/cart/retrieve',
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        //data: JSON.stringify(data),
        success: function(response){
            if (response.msg == 'notLogedIn') {
                console.log('Cannot retrieve cart, user not logged in.');
            }
            else {
                
            }
        },
        error:function(err){
            console.log("Could not retrieve cart from server");
        }
    });
}

//AJAX order submit
function submitOrderServer(e) {
    console.log('Attempting to submit order to server');
    $.ajax({  
        url:'/cart/submit',  
        type:'get',  
        dataType:'json',
        contentType:'application/json',  
        success:function(response){  
            if(response.msg == 'success') {
                submitOrder(e);
                console.log("Order has succesfully been submitted")
            }
        },  
        error:function(response){  
            console.log("A server error has occurred, order not submitted"); 
        }  
    });  
}

function orderCheck(e) {
    if (totalPrice() == 0) {
        alert("Cannot submit order. Your cart is empty.");
    }
    else {
        submitOrderServer(e);
    }

}

function submitOrder(e) {
    let inputFields = document.querySelectorAll(".product__quantity");
    for (let inputField of inputFields) {
        inputField.value = 0;
        changeProductQuantity(inputField.name, inputField.value);
    }
}

function clearCart() {
    let inputFields = document.querySelectorAll(".product__quantity");
        for (let inputField of inputFields) {
            inputField.value = 0;
            changeProductQuantity(inputField.name, inputField.value);
        }
        cart.clear;
}