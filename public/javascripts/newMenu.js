const menuContent = document.getElementById('menu-content');

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






