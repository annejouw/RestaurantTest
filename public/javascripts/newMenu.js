const menuContent = document.getElementById('menu-content');

let menuPageMain = document.querySelector(".menu")

//creates listeners that send appropriate ajax request for menu links
let menuLinkArray = document.querySelectorAll(".menu__link");
menuLinkArray.forEach(menuLink => addMenuLinkListener(menuLink));

function addMenuLinkListener(menuLink){
    menuLink.addEventListener("click", menuLinkEventHandler, false);
}

function menuLinkEventHandler(evt){
    let menuLinkElement = evt.target; //this is the button html element
    let requestedCategory = menuLinkElement.value; //this is the value string in the button, which should be the same as the table name on server

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

function replaceMenuItems(newCategory, dishesInfoArray){
    deleteOldGrid()
    createGridContainer();
    createGrid(newCategory, dishesInfoArray)
}

function deleteOldGrid(){
    let oldCategoryContainer = document.querySelector(".category-container");
    if (oldCategoryContainer){
        oldCategoryContainer.remove();
    }
};

//creates a product container for each dish
function createGrid(category, dishesInfoArray){
    dishesInfoArray.forEach(dishInfo => createProductContainer(category, dishInfo));
}

//category can be Sashimi, Nigiri, Maki, Dessert, or Drink
function createProductContainer(category, dishInfo){

    //Creating product container
    let productDisplay = document.createElement('article');
    productDisplay.classList.add("category-grid__product");

    //Adding product heading
    let productHeading = document.createElement('h1');
    let productHeadingText = document.createTextNode(dishInfo.dishName);
    productHeading.classList.add("product__header")
    productHeading.appendChild(productHeadingText);
    productDisplay.appendChild(productHeading);

    //Adding product information and image
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

    switch (category){
        case 'Sashimi':
            let productIngr = document.createElement('p');
            let productIngrText = document.createTextNode("Ingredients: " + dishInfo.ingredients);
            productIngr.appendChild(productIngrText);
            productDesc.appendChild(productIngr);
            break;
        case 'Nigiri':

            break;
        case 'Maki':

            break;
        case 'Desserts':

            break;
        case 'Drinks':

            break;
        default:
            throw new BadCategoryException(category)
    }

    productDiv.appendChild(productDesc);
    productDisplay.appendChild(productDiv);

    //Adding item manipulation
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

function createSashimiGrid(dishesInfoArray) {
    dishesInfoArray.forEach(dishInfo => createProductContainer(dishInfo));
}

function createProductContainer(dishInfo){

    //Creating product container
    let productDisplay = document.createElement('article');
    productDisplay.classList.add("category-grid__product");

    //Adding product heading
    let productHeading = document.createElement('h1');
    let productHeadingText = document.createTextNode(dishInfo.dishName);
    productHeading.classList.add("product__header")
    productHeading.appendChild(productHeadingText);
    productDisplay.appendChild(productHeading);

    //Adding product information and image
    let productDiv = document.createElement('div');
    productDiv.classList.add("product__description");

    let productImage = document.createElement('img');
    productImage.setAttribute("src", dishInfo.imageURL);
    productImage.setAttribute("alt", dishInfo.dishName);
    productImage.classList.add("product__image");
    productDiv.appendChild(productImage);

    let productDesc = document.createElement('div');

    let productIngr = document.createElement('p');
    let productIngrText = document.createTextNode("Ingredients: " + dishInfo.ingredients);
    productIngr.appendChild(productIngrText);
    productDesc.appendChild(productIngr);

    let productPrice = document.createElement('p');
    let productPriceText = document.createTextNode("Price: €" + dishInfo.price);
    productPrice.appendChild(productPriceText);
    productDesc.appendChild(productPrice);

    productDiv.appendChild(productDesc);
    productDisplay.appendChild(productDiv);

    //Adding item manipulation
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

function createGridContainer() {
    let flexDiv = document.createElement('div');
    flexDiv.classList.add("category-container");

    let gridDiv = document.createElement('div');
    gridDiv.classList.add("category-container__category-grid");
    flexDiv.appendChild(gridDiv);

    menuPageMain.appendChild(flexDiv);
}

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
    // updateCart();
    // drawCart();

    console.log(productObject.name + " : " + productObject.quantity);
}

function BadCategoryException(category){
    this.category = category;
    this.message = 'is not a valid category received from server';
    this.toString = function() {
        return this.category + this.message;
    };
}
