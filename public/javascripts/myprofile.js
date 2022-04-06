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
        showMessage("noMessage");
    }
}

function showMessage(message) { //Hide all messages and show correct message
    let successMessage = document.getElementById('personal-info__success-message');
    successMessage.style.display = "none";

    let emailMessage = document.getElementById('personal-info__warning');
    emailMessage.style.display = "none";

    let passwordSuccess = document.getElementById('personal-info__password-success');
    passwordSuccess.style.display = "none";

    let passwordIncorrect = document.getElementById('personal-info__password-warning');
    passwordIncorrect.style.display = "none";

    let passwordInsecure = document.getElementById('personal-info__password-insecure');
    passwordInsecure.style.display = "none";

    let passwordsDontMatch = document.getElementById('personal-info__password-nomatch');
    passwordsDontMatch.style.display = "none";

    if (message == "successMessage") {
        successMessage.style.display = "block";
    }

    if (message == "emailMessage") {
        emailMessage.style.display = "block";
    }

    if (message == "passwordSuccess") {
        passwordSuccess.style.display = "block";
    }

    if (message == "passwordIncorrect") {
        passwordIncorrect.style.display = "block";
    }

    if (message == "passwordInsecure") {
        passwordInsecure.style.display = "block";
    }

    if (message == "passwordsDontMatch") {
        passwordsDontMatch.style.display = "block";
    }
}

function retrieveInfo(e) {
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
    phone.value = res.phone.slice(2);
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
                showMessage("emailMessage");
            }

            if(response.msg == 'success') {
                showMessage("successMessage");
            }
        },  
        error:function(response){  
            console.log("A server error has occurred"); 
        }  
    });
    e.preventDefault();
}

function editPassword(e) {
    let oldPassword = document.getElementById('personal-info__password--old').value;
    let newPassword1 = document.getElementById('personal-info__password--new').value;
    let newPassword2 = document.getElementById('personal-info__password--second-new').value;

    if (newPassword1 === newPassword2) {
        let data = { 'oldPassword':oldPassword,
                     'newPassword':newPassword1 };
        
        $.ajax({  
            url:'/profile/editpassword',  
            type:'post',  
            dataType:'json',
            contentType:'application/json',  
            data: JSON.stringify(data),  
            success:function(response){  
                if(response.msg == 'noMatch') {
                    showMessage("passwordIncorrect");
                }

                if(response.msg == 'regexp') {
                    showMessage("passwordInsecure");
                }
    
                if(response.msg == 'success') {
                    showMessage("passwordSuccess");
                }
            },  
            error:function(response){  
                console.log("A server error has occurred"); 
            }  
        });
    }

    else {
        showMessage("passwordsDontMatch");
    }

    document.getElementById('personal-info__password--old').value = "";
    document.getElementById('personal-info__password--new').value = "";
    document.getElementById('personal-info__password--second-new').value = "";
    e.preventDefault();
}