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
            throw new Error(category + 'is not a valid category to request')
    }

    productDiv.appendChild(productDesc);
    productDisplay.appendChild(productDiv);

    //Adds button for the user to select requested number of dishes to add to cart.
    let quantityChooserDiv = document.createElement('div');
    quantityChooserDiv.classList.add("product__quantitychooser");

    let quantityShower = document.createElement('p')
    quantityShower.classList.add('product__quanititychooser--quantityshower')
    quantityShower.setAttribute('id', 'quantityshower_' + dishInfo.dishName)
    quantityShower.innerHTML = "0";

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
    quantityChooserDiv.appendChild(quantityShower)
    quantityChooserDiv.appendChild(plusButton);

    productDisplay.appendChild(quantityChooserDiv);

    let categoryGridContainer = document.querySelector(".category-container__category-grid");
    categoryGridContainer.appendChild(productDisplay);
}

function changeRequestedQuantity(ev){
    //get ev.target name of dish
    //send http request to increase by 1
    let clickedButton = ev.target;
    let toChangeDish = clickedButton.name;

    let quantityChangerHTTPRequest = new XMLHttpRequest();
    quantityChangerHTTPRequest.open('POST', '/cart/change');
    quantityChangerHTTPRequest.setRequestHeader("Content-Type", "application/json")

    switch (clickedButton.value){
        case 'increase':
            quantityChangerHTTPRequest.send(JSON.stringify({
                "dishname":toChangeDish,
                "change":'increase'
            }));
            break;

        case 'decrease':
            quantityChangerHTTPRequest.send(JSON.stringify({
                "dishname":toChangeDish,
                "change":"decrease"
            }));
            break;

        default:
            console.log('could not change value, ' + clickedButton.value + ' is not increase or decrease')
            throw new Error('wrong change value in button')
    }

    quantityChangerHTTPRequest.onreadystatechange = function(){
        if (quantityChangerHTTPRequest.readyState == 4 && quantityChangerHTTPRequest.status == 200) {
            //change accepted, now retrieve cart, and draw the cart when it is retrieved
            console.log('attempting to retrieve cart')
            setTimeout(retrieveServerCart(), 2)
        }
        if (quantityChangerHTTPRequest.readyState == 4 && quantityChangerHTTPRequest.status == 400){
            //item did not update, give user some help provided by server
            alert(quantityChangerHTTPRequest.responseText)
        }
    }

}

function retrieveServerCart(){
    console.log("attempting to retrieve cart from server");

    let retrieveCartHTTPRequest = new XMLHttpRequest();
    retrieveCartHTTPRequest.open('GET', '/cart/retrieve');
    retrieveCartHTTPRequest.setRequestHeader("Content-Type", "application/json");
    retrieveCartHTTPRequest.send();

    retrieveCartHTTPRequest.onreadystatechange = function(){
        if (retrieveCartHTTPRequest.readyState == 4 && retrieveCartHTTPRequest.status == 200) {
            //cart retrieved, now draw it
            console.log('attempting to draw cart')
            let retrievedCart = retrieveCartHTTPRequest.response
            setTimeout(drawCart(retrievedCart), 2);
        }
        if (retrieveCartHTTPRequest.readyState == 4 && retrieveCartHTTPRequest.status == 400){
            //item did not update, give user some help provided by server
            alert(retrieveCartHTTPRequest.responseText)
        }
    }
}

function drawCart(retrievedCart){
    deleteOldCart()
    let currentCartArray = JSON.parse(retrievedCart)
    currentCartArray.forEach(item => drawItem(item))
}

function deleteOldCart(){
    let cartContent = document.querySelector(".cart__content")
    while (cartContent.firstChild){
        cartContent.removeChild(cartContent.firstChild)
    }
}

function drawItem(item){
    let itemCount = item.itemCount;
    let itemName = item.foodItem;

    let cartContent = document.querySelector(".cart__content")

    let dishElement = document.createElement('p');
    dishElement.innerHTML = itemCount + 'x ' + itemName

    cartContent.appendChild(dishElement)

    quantityShower = document.getElementById('quantityshower_' + itemName)
    quantityShower.innerHTML = itemCount;
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
