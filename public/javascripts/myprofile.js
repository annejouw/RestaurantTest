//Adding event listeners to the page
let tabLinks = document.getElementsByClassName('tab__link');
for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener("click", openTab, false);
}

let defaultOpenTab = document.getElementById('tab__link--default');
defaultOpenTab.click();

window.addEventListener("load", retrieveInfo, false);

function openTab(e) { //Tab functionality
    let infoTab, orderTab;
    infoTab = document.getElementById('personal-info');
    orderTab = document.getElementById('order-history');

    if (e.target.name === 'personal-info') {
        infoTab.style.display = "block";
        orderTab.style.display = "none";
    }

    if (e.target.name === 'order-history') {
        infoTab.style.display = "none";
        orderTab.style.display = "block";
    }
}

function retrieveInfo(e) {
    $.ajax({  
        url:'/profile/retrieve',  
        type:'post',  
        dataType:'json',
        contentType:'application/json',  
        data: JSON.stringify(data),  
        success:function(response){  
            if(response.msg == 'success') {
                displayInfo(response);
            }
        },  
        error:function(response){  
            console.log("A server error has occurred"); 
        }  
    });  
}

function displayInfo(response) {
    let email = document.getElementById('personal-info__email');
    let password = document.getElementsByClassName('personal-info__password')[0];
    let firstName = document.getElementById('personal-info__first-name');
    let lastName = document.getElementById('personal-info__last-name');
    let phone = document.getElementById('personal-infom__phone');
    let streetAddress = document.getElementById('personal-info__street-address');
    let zipCode = document.getElementById('personal-info__zip-code');
    let city = document.getElementById('personal-info__city-name');


}