

const menuContent = document.getElementById('menu-content')

let dishHTTPRequest = new XMLHttpRequest();
dishHTTPRequest.onreadystatechange = function (){
    if (dishHTTPRequest.readyState === 4 && dishHTTPRequest.status === 200){
        //Dish received
        console.log("dish received")
        dishJSON = JSON.parse(dishHTTPRequest.responseText)
        addDishToPage(dishJSON)
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


dishHTTPRequest.open('POST', '/dish/1', true);
dishHTTPRequest.send();


