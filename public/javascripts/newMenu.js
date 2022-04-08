const menuContent = document.getElementById('menu-content');


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

//creates listeners that send appropriate XMLHttpRequest for menu links
let menuLinkArray = document.querySelectorAll(".menu__link")
menuLinkArray.forEach(menuLink => addMenuLinkListener(menuLink))

function addMenuLinkListener(menuLink){
    menuLink.addEventListener("click", menuLinkEventHandler)
}

/*
-
-Uses the value property of the html element to determine the Category to send to the server with an http server
*/

function menuLinkEventHandler(evt){
    let menuLinkElement = evt.target; //this is the button html element
    let requestedCategory = menuLinkElement.value; //this is the value string in the button, which should be the same as the table name on server

    let HTTPRequestURL = '/dish/' + requestedCategory;

    /*dishHTTPRequest.open('POST', HTTPRequestURL, true);
    dishHTTPRequest.send();*/

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






