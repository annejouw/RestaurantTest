const menuContent = document.getElementById('menu-content')

let dishHTTPRequest = new XMLHttpRequest();
dishHTTPRequest.onreadystatechange = function (){
    if (dishHTTPRequest.readyState === 4 && dishHTTPRequest.status === 200){
        //Dish received
        console.log(dishHTTPRequest.responseText);
        // console.log("dish received")
        // dishJSON = JSON.parse(dishHTTPRequest.responseText)
        // addDishToPage(dishJSON)
    }
}

function addDishToPage(dishJSON){
    console.log("tried to add item")
    let newDish = document.createElement("div")

    let newDishHeading = document.createElement("h1")
    newDishHeading.innerHTML = dishJSON.name;

    let newDishImage = document.createElement('img')
    newDishImage.setAttribute('src', dishJSON.imageurl)

    newDish.appendChild(newDishHeading);
    newDish.appendChild(newDishImage)

    menuContent.appendChild(newDish);
}

//creates listeners that trigger appropriate XMLHttpRequest for menu links
let menuLinkArray = document.querySelectorAll(".menu__link")
menuLinkArray.forEach(menuLink => addMenuLinkListener(menuLink))

function addMenuLinkListener(menuLink){
    menuLink.addEventListener("click", menuLinkEventHandler())
}

function menuLinkEventHandler(evt){
    menuLinkElement = evt.target; //this is the button html element
    requestedCategory = menuLinkElement.value; //this is the value string in the button, which should be the same as the table name on server

    HTTPRequestURL = '/dish/' + requestedCategory

    dishHTTPRequest.open('POST', HTTPRequestURL, true);
    dishHTTPRequest.send();
}


