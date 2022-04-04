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
    console.log('Attempting to retrieve info');
    $.ajax({  
        url:'/profile/retrieve',  
        type:'post',  
        dataType:'json',
        contentType:'application/json',  
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

function displayInfo(res) {
    console.log('adding info');
    let firstName = document.getElementById('personal-info__first-name');
    let lastName = document.getElementById('personal-info__last-name');
    let email = document.getElementById('personal-info__email');
    let phone = document.getElementById('personal-info__phone');
    let streetAddress = document.getElementById('personal-info__street-address');
    let zipCode = document.getElementById('personal-info__zip-code');
    let city = document.getElementById('personal-info__city-name');

    firstName.value = res.firstName;
    lastName.value = res.lastName;
    email.value = res.email;
    phone.value = res.phone;
    streetAddress.value = res.streetAddress;
    zipCode.value = res.zipCode;
    city.value = res.city;
}