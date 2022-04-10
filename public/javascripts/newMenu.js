const menuContent = document.getElementById('menu-content');

let menuPageMain = document.querySelector(".menu")

//creates listeners that send appropriate ajax request for menu links
let menuLinkArray = document.querySelectorAll(".menu__link");
menuLinkArray.forEach(menuLink => addMenuLinkListener(menuLink));

function addMenuLinkListener(menuLink){
    menuLink.addEventListener("click", menuLinkEventHandler, false);
}

let firstMenuLink = document.querySelector(".menu__link");
firstMenuLink.click();

function menuLinkEventHandler(evt){
    let menuLinkElement = evt.target; //this is the button html element, that allows the user to select a category.
    let requestedCategory = menuLinkElement.value; //this represents the category that the user wants to change to.

    let HTTPRequestURL = '/dish/' + requestedCategory;

    $.ajax({
        url:HTTPRequestURL,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        success:function(response, status, xhr){
            console.log(response);
            let category = xhr.getResponseHeader('category');
            console.log(category);
            replaceMenuItems(category, response);
        },
        error:function(response){
            console.log("A server error has occurred");
        }
    });
}

//Handles the dynamic menu generation for each category.
function replaceMenuItems(newCategory, dishesInfoArray){
    deleteOldGrid()
    createGridContainer();
    createGrid(newCategory, dishesInfoArray)
}

//Deletes the old grid of cards, if it exists.
function deleteOldGrid(){
    let oldCategoryContainer = document.querySelector(".category-container");
    if (oldCategoryContainer){
        oldCategoryContainer.remove();
    }
};

//Creates the grid of cards containing dishes, using information from the server.
function createGrid(category, dishesInfoArray){
    dishesInfoArray.forEach(dishInfo => createProductCard(category, dishInfo));
}

/*
-Creates one card from the dishInfo (JSON) provided by server.
-The category can be Sashimi, Nigiri, Maki, Dessert, or Drink.
 */
function createProductCard(category, dishInfo){

    //Creates the product container.
    let productDisplay = document.createElement('article');
    productDisplay.classList.add("category-grid__product");

    //Adds the product heading.
    let productHeading = document.createElement('h1');
    let productHeadingText = document.createTextNode(dishInfo.dishName);
    productHeading.classList.add("product__header")
    productHeading.appendChild(productHeadingText);
    productDisplay.appendChild(productHeading);

    //Adds product information and image.
    let productDiv = document.createElement('div');
    productDiv.classList.add("product__description");

    let productImage = document.createElement('img');
    productImage.setAttribute("src", dishInfo.imageURL);
    productImage.setAttribute("alt", dishInfo.dishName);
    productImage.classList.add("product__image");
    productDiv.appendChild(productImage);

    let productDesc = document.createElement('div');

    let productPrice = document.createElement('p');
    let productPriceText = document.createTextNode("Price: €" + dishInfo.price);
    productPrice.appendChild(productPriceText);
    productDesc.appendChild(productPrice);

    //Allows for dynamic product description, based upon the category requested. Assumes the category dish information retrieved is correct.
    switch (category){
        case 'Sashimi': {
            let productIngr = document.createElement('p');
            let productIngrText = document.createTextNode("Ingredients: " + dishInfo.ingredients);
            productIngr.appendChild(productIngrText);
            productDesc.appendChild(productIngr);
            break;
        }
        case 'Nigiri':
        case 'Maki': {
            let productIngr = document.createElement('p');
            let productIngrText = document.createTextNode("Ingredients: " + dishInfo.ingredients);
            productIngr.appendChild(productIngrText);
            productDesc.appendChild(productIngr);

            if (dishInfo.vegetarian === 1) {
                let vegetarian = document.createElement('p');
                let vegetarianText = document.createTextNode("Vegetarian");
                vegetarian.appendChild(vegetarianText);
                productDesc.appendChild(vegetarian);
            }
        }
            break;
        case 'Desserts': {
                let productAllergen = document.createElement('p');
                let productAllergenText = document.createTextNode("Allergens: " + dishInfo.allergens);
                productAllergen.appendChild(productAllergenText);
                productDesc.appendChild(productAllergen);
        }
            break;
        case 'Drinks':
            let productVolume = document.createElement('p');
            let productVolumeText = document.createTextNode("Volume: " + dishInfo.volume);
            productVolume.appendChild(productVolumeText);
            productDesc.appendChild(productVolume);

            if (dishInfo.alcoholFree === 0) {
                let alcoholIndicator = document.createElement('p');
                let alcoholText = document.createTextNode("Contains alcohol, 18+");
                alcoholIndicator.appendChild(alcoholText);
                productDesc.appendChild(alcoholIndicator);
            }
            break;
        default:
            throw new BadCategoryException(category)
    }

    productDiv.appendChild(productDesc);
    productDisplay.appendChild(productDiv);

    //Adds button for the user to select requested number of dishes to add to cart.
    let incrementerDiv = document.createElement('div');
    incrementerDiv.classList.add("product__incrementer");

    let minusButton = document.createElement('button');
    let minusButtonText = document.createTextNode("-");
    minusButton.setAttribute("type", "button");
    minusButton.setAttribute("name", dishInfo.dishName + " decrease");
    minusButton.classList.add("product__incrementer--minus");
    minusButton.appendChild(minusButtonText);
    minusButton.addEventListener("click", decrease, false);

    let quantityInput = document.createElement('input');
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("name", dishInfo.dishName + " quantity");
    quantityInput.setAttribute("value", "0");
    quantityInput.setAttribute("min", "0");
    quantityInput.classList.add("product__quantity");
    quantityInput.addEventListener("change", inputFieldChange, false);

    let plusButton = document.createElement('button');
    let plusButtonText = document.createTextNode("+");
    plusButton.setAttribute("type", "button");
    plusButton.setAttribute("name", dishInfo.dishName + " increase");
    plusButton.classList.add("product__incrementer--plus");
    plusButton.appendChild(plusButtonText);
    plusButton.addEventListener("click", increase, false);

    incrementerDiv.appendChild(minusButton);
    incrementerDiv.appendChild(quantityInput);
    incrementerDiv.appendChild(plusButton);

    productDisplay.appendChild(incrementerDiv);

    let categoryGridContainer = document.querySelector(".category-container__category-grid");
    categoryGridContainer.appendChild(productDisplay);
}

//Creates an empty container that will contain the grid of cards.
function createGridContainer() {
    let flexDiv = document.createElement('div');
    flexDiv.classList.add("category-container");

    let gridDiv = document.createElement('div');
    gridDiv.classList.add("category-container__category-grid");
    flexDiv.appendChild(gridDiv);

    menuPageMain.appendChild(flexDiv);
}


//Functions for cart functionality.
function increase(e) {
    let inputField = e.target.parentElement.children[1];
    inputField.value = parseInt(inputField.value) + 1;

    changeProductQuantity(inputField.name, inputField.value);
}

function decrease(e) {
    let inputField = e.target.parentElement.children[1];
    if (parseInt(inputField.value) != 0) {
        inputField.value = parseInt(inputField.value) - 1;
        changeProductQuantity(inputField.name, inputField.value);
    }
}

function inputFieldChange(e) {
    let value = parseInt(e.target.value);
    let name = e.target.name;
    if (!(value >= 0) || isNaN(value) || value == -0) {
        e.target.value = 0;
    }
    changeProductQuantity(name, e.target.value);
}

function changeProductQuantity(name, value) {
    let productObject = dict[name];
    productObject.quantity = parseInt(value);
    updateCart();
    drawCart();

    console.log(productObject.name + " : " + productObject.quantity);
}

//Added an error for when the category received is not correct.
function BadCategoryException(category){
    this.category = category;
    this.message = 'is not a valid category received from server';
    this.toString = function() {
        return this.category + this.message;
    };
}
