//Adding event listeners to the page
let tabLinks = document.getElementsByClassName('tab__link');
for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener("click", openTab, false);
}

let defaultOpenTab = document.getElementById('tab__link--default');
defaultOpenTab.addEventListener("click", retrieveInfo, false);
defaultOpenTab.click();

let editForm = document.getElementById('personal-info__info-form');
editForm.addEventListener("submit", editInfo, false);

let passwordForm = document.getElementById('personal-info__password-form');
passwordForm.addEventListener("submit", editPassword, false);

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
        hideMessages();
    }
}

function hideMessages() {
    let successMessage = document.getElementById('personal-info__success-message');
    successMessage.style.display = "none";
    let emailMessage = document.getElementById('personal-info__warning');
    emailMessage.style.display = "none";
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

function editInfo(e) {
    let email = document.getElementById('personal-info__email').value;
    let firstName = document.getElementById('personal-info__first-name').value;
    let lastName = document.getElementById('personal-info__last-name').value;
    let phone = document.getElementById('personal-info__phone').value;
    let streetAddress = document.getElementById('personal-info__street-address').value;
    let zipCode = document.getElementById('personal-info__zip-code').value;
    let city = document.getElementById('personal-info__city-name').value;
    var data = { 'email':email,
                 'firstName':firstName,
                 'lastName':lastName,
                 'phone':phone,
                 'streetAddress':streetAddress,
                 'zipCode':zipCode,
                 'city':city };
    
    $.ajax({  
        url:'/profile/editinfo',  
        type:'post',  
        dataType:'json',
        contentType:'application/json',  
        data: JSON.stringify(data),  
        success:function(response){  
            if(response.msg == 'exists') {
                showEmailInUse();
            }

            if(response.msg == 'success') {
                showChangeSuccess();
            }
        },  
        error:function(response){  
            console.log("A server error has occurred"); 
        }  
    });
    e.preventDefault();
}

function showEmailInUse() {
    let emailMessage = document.getElementById('personal-info__warning');
    emailMessage.style.display = "block";
    
    let successMessage = document.getElementById('personal-info__success-message');
    successMessage.style.display = "none";
}

function showChangeSuccess() {
    let emailMessage = document.getElementById('personal-info__warning'); //Remove this message in case it was shown before
    emailMessage.style.display = "none";

    let successMessage = document.getElementById('personal-info__success-message');
    successMessage.style.display = "block";
}

function editPassword(e) {
    
    e.preventDefault();
}