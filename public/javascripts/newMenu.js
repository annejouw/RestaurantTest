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

let submitButton = document.getElementById('cart__submit');
submitButton.addEventListener("submit", submitOrder, false);

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
    deleteOldGrid();
    createGridContainer();
    createGrid(newCategory, dishesInfoArray);
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
    let quantityChooserDiv = document.createElement('div');
    quantityChooserDiv.classList.add("product__quantitychooser");

    let minusButton = document.createElement('button');
    let minusButtonText = document.createTextNode("-");
    minusButton.setAttribute("type", "button");
    minusButton.setAttribute("name", dishInfo.dishName);
    minusButton.setAttribute("value", "decrease");
    minusButton.classList.add("product__quantitychooser--minus");
    minusButton.appendChild(minusButtonText);
    minusButton.addEventListener("click", changeRequestedQuantity, false);

    let plusButton = document.createElement('button');
    let plusButtonText = document.createTextNode("+");
    plusButton.setAttribute("type", "button");
    plusButton.setAttribute("name", dishInfo.dishName);
    plusButton.setAttribute("value", "increase");
    plusButton.classList.add("product__quantitychooser--plus");
    plusButton.appendChild(plusButtonText);
    plusButton.addEventListener("click", changeRequestedQuantity, false);

    quantityChooserDiv.appendChild(minusButton);
    quantityChooserDiv.appendChild(plusButton);

    productDisplay.appendChild(quantityChooserDiv);

    let categoryGridContainer = document.querySelector(".category-container__category-grid");
    categoryGridContainer.appendChild(productDisplay);
}

function changeRequestedQuantity(ev){
    //get ev.target name of dish
    //send http request to increase by 1
    clickedButton = ev.target;
    toChangeDish = clickedButton.name;
    let quantityChangerHTTPRequest = new XMLHttpRequest();

    switch (clickedButton.value){
        case 'increase':
            quantityChangerHTTPRequest.open('POST', '/cart/change/increase');
            break;

        case 'decrease':
            quantityChangerHTTPRequest.open('POST', '/cart/change/decrease');
            break;

        default:
            console.log('could not change value, ' + clickedButton.value + ' is not increase or decrease')
            throw new Error('wrong change value in button')
    }

    quantityChangerHTTPRequest.send(toChangeDish);
    quantityChangerHTTPRequest.onreadystatechange = function(){
        if (quantityChangerHTTPRequest.readyState == 4 && quantityChangerHTTPRequest.status == 200) {

        }
        if (quantityChangerHTTPRequest.readyState == 4 && quantityChangerHTTPRequest.status == 400){
            alert(quantityChangerHTTPRequest.responseText)
        }
    }

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

//Added an error for when the category received is not correct.
function BadCategoryException(category){
    this.category = category;
    this.message = 'is not a valid category received from server';
    this.toString = function() {
        return this.category + this.message;
    };
}

//Submitting the order by moving the current order to the order history table
function submitOrder(e) {
    $.ajax({
        url:'/cart/submit',
        type:'post',
        dataType:'json',
        contentType:'application/json',
        success:function(response, status, xhr){
            if (response.msg == 'success') {
                console.log('order succesfully submitted');
            }

            if (response.msg == 'empty') {
                console.log('empty cart')
            }
        },
        error:function(response){
            console.log("A server error has occurred");
        }
    });

    e.preventDefault();
}
