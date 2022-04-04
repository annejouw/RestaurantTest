//Adding event listeners to the page
let tabLinks = document.getElementsByClassName('tab__link');
for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener("click", openTab, false);
}

let defaultOpenTab = document.getElementById('tab__link--default');
defaultOpenTab.click();

let passwordInput = document.getElementById('login-form__checkbox');
passwordInput.addEventListener("click", showPassword, false);

let passwordField1 = document.getElementsByClassName('register-form__password')[0];
let passwordField2 = document.getElementsByClassName('register-form__password')[1];
passwordField1.addEventListener("change", checkPassword, false);
passwordField2.addEventListener("change", checkPassword, false);

let loginForm = document.getElementById('login-form__content');
loginForm.addEventListener("submit", addToDatabase, false);

let registerForm = document.getElementById('register-form__content');
registerForm.addEventListener("submit", searchDatabase, false);

/* Event handlers */
//Logging a user in
function addToDatabase(e) {
    let email = document.getElementById('login-form__email').value;
    let password = document.getElementById('login-form__password').value;
    var data = { 'email':email,
                 'password':password }
    
    $.ajax({  
        url:'/login/authenticate',  
        type:'post',  
        dataType:'json',
        contentType:'application/json',  
        data: JSON.stringify(data),  
        success:function(response){  
            if(response.msg == 'invalid') {  
                showInvalidResponse();
            }

            if(response.msg == 'empty') {  
                showEmptyResponse();
            }
            
            if(response.msg == 'success') {
                window.location.replace(response.url);
            }
        },  
        error:function(response){  
            console.log("A server error has occurred"); 
        }  
    });

    e.preventDefault();
}

function showInvalidResponse() { //Shown when username and/or password is incorrect
    let invalidResponse = document.getElementById('login-form__input-check--invalid');
    invalidResponse.style.display = "block";
    let emptyResponse = document.getElementById('login-form__input-check--empty');
    emptyResponse.style.display = "none";
}

function showEmptyResponse() { //Shown when username and/or password fields are left empty
    let invalidResponse = document.getElementById('login-form__input-check--invalid');
    invalidResponse.style.display = "none";
    let emptyResponse = document.getElementById('login-form__input-check--empty');
    emptyResponse.style.display = "block";
}


function showPassword(e) { //Used to show password in text format
    var toggle = document.getElementById('login-form__password')
    if (toggle.type === 'password') {
        toggle.type = 'text';
    }
    else {
        toggle.type = 'password';
    }
}

function openTab(e) { //Switching between login and register tabs
    let loginTab, registerTab;
    loginTab = document.getElementById('login-form');
    registerTab = document.getElementById('register-form');

    if (e.target.name === 'login') {
        loginTab.style.display = "block";
        registerTab.style.display = "none";
    }

    if (e.target.name === 'register') {
        loginTab.style.display = "none";
        registerTab.style.display = "block";
    }
}

function checkPassword(e) { //Checks if entered passwords match   
    let check = document.getElementById('register-form__warning');
    if (comparePasswords()) {
        check.style.display = "none";
    }
    else {
        check.style.display = "block";
    }

    //Remove the insecure warning when changing the passwords
    let insecureResponse = document.getElementById('register-form__input-check--insecure');
    insecureResponse.style.display = "none";
}

function comparePasswords() { //Returns true if the passwords match
    let passwords = document.getElementsByClassName('register-form__password');
    let password1 = passwords[0].value;
    console.log(password1);
    let password2 = passwords[1].value;
    console.log(password2);
    console.log("checking passwords");
    if (password1 === password2) {
        console.log("passwords are the same");
    }
    return (password1 === password2);
}

function searchDatabase(e) {
    let email = document.getElementById('register-form__email').value;
    let password = document.getElementsByClassName('register-form__password')[0].value;
    let firstName = document.getElementById('register-form__first-name').value;
    let lastName = document.getElementById('register-form__last-name').value;
    let phone = document.getElementById('register-form__phone').value;
    let streetAddress = document.getElementById('register-form__street-address').value;
    let zipCode = document.getElementById('register-form__zip-code').value;
    let city = document.getElementById('register-form__city-name').value;
    var data = { 'email':email,
                 'password':password,
                 'firstName':firstName,
                 'lastName':lastName,
                 'phone':phone,
                 'streetAddress':streetAddress,
                 'zipCode':zipCode,
                 'city':city };
    if (comparePasswords()) {
        console.log("passwords are the same");
        $.ajax({  
            url:'/login/register',  
            type:'post',  
            dataType:'json',
            contentType:'application/json',  
            data: JSON.stringify(data),  
            success:function(response){  
                if(response.msg == 'exists') {  
                    showUserExists();
                }

                if(response.msg == 'regexp') {
                    showPasswordInsecure();
                }
    
                if(response.msg == 'success') {
                    window.location.replace(response.url);
                }
            },  
            error:function(response){  
                console.log("A server error has occurred"); 
            }  
        });
    }
    e.preventDefault();
}

function showUserExists() {
    let userExistsResponse = document.getElementById('register-form__input-check--exists');
    userExistsResponse.style.display = "block";
    let insecureResponse = document.getElementById('register-form__input-check--insecure');
    insecureResponse.style.display = "none";
}

function showPasswordInsecure() {
    let insecureResponse = document.getElementById('register-form__input-check--insecure');
    insecureResponse.style.display = "block";
}


