let currentPage = 1;

function addElementToPage(){

}

//new htp request POST newmenupage/nigiri of newmenupage/sashimi
//dan een post handler voor newmenupage die daarna doorgaat met sashimi, nigiri of wat dan ook

let menuContent = document.getElementById("menu-content")
let fruitPic = document.createElement("img");
fruitPic.setAttribute("src", '/images/fruits.jpg');

menuContent.appendChild(fruitPic);
