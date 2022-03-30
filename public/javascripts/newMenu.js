let currentPage = 1;

function addElementToPage(){

}

//new htp request POST newmenupage/nigiri of newmenupage/sashimi
//dan een post handler voor newmenupage die daarna doorgaat met sashimi, nigiri of wat dan ook

let menuContent = document.getElementById("menu-content")
let fruitPic = document.createElement("img");
fruitPic.setAttribute("src", '/images/fruits.jpg');

//sends request for new menu items json
menuItemshttpRequest = new XMLHttpRequest();
menuItemshttpRequest.onreadystatechange = function (){
    if (menuItemshttpRequest.readyState === 4 && menuItemshttpRequest.status === 200){
        var response = JSON.parse(menuItemshttpRequest.responseText)
    }
}
menuItemshttpRequest.open('POST', 'Router url', true)
menuItemshttpRequest.send("new page nigiri")

//test
imagehttpRequest = new XMLHttpRequest();
imagehttpRequest.onreadystatechange = function (){
    if (menuItemshttpRequest.readyState === 4 && menuItemshttpRequest.status === 200){
        //image received
        menuContent.appendChild(fruitPic);
    }
}

imagehttpRequest.open('GET', "/images/fruits.jpg", true)
imagehttpRequest.send();
