//Adding event listeners to the page
let tabLinks = document.getElementsByClassName('tab__link');
for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener("click", openTab, false);
}

let defaultOpenTab = document.getElementById('tab__link--default')
defaultOpenTab.click();

let passwordInput = document.getElementById('login-form__checkbox');
passwordInput.addEventListener("click", showPassword, false);

let passwordCheck = document.getElementsByClassName('register-form__password')[1];
passwordCheck.addEventListener("change", checkPassword, false);

let loginForm = document.getElementById('login-form__content');
loginForm.addEventListener("submit", searchDatabase, false);

//Event handlers
function searchDatabase(e) { //Werkt voor geen meter helaas
    console.log("prevented default action v2");
    let email = document.getElementById('login-form__email');
    let password = document.getElementById('login-form__password');
    var req = new XMLHttpRequest();
    req.open("POST", "/authenticate", true);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            var res = req.responseText;
            if (res == 'invalid') {
                showInvalidResponse();
                console.log('invalid response');
            }
            if (res == 'empty') {
                showEmptyResponse();
                console.log('empty response');
            }
        }
    }
    req.send("{ 'email': " + email + ", 'password': " + password + "}");
    /*
    $.ajax({  
        url:'/authenticate',  
        type:"POST",  
        dataType:'json',  
        data:{'email':email,
              'password':password},  
        success:function(response){  
            if(response.msg=='invalid') {  
                showInvalidResponse();
            }

            if(response.msg=='empty') {  
                showEmptyResponse();
            }  
        },  
        error:function(response){  
            console.log("A server error has occurred"); 
        }  
    });*/

    e.preventDefault();
}

function showInvalidResponse() {
    let invalidResponse = document.getElementById('login-form__input-check--invalid');
    invalidResponse.style.display = block;
    let emptyResponse = document.getElementById('login-form__input-check--empty');
    emptyResponse.style.display = none;
}

function showEmptyResponse() {
    let invalidResponse = document.getElementById('login-form__input-check--invalid');
    invalidResponse.style.display = none;
    let emptyResponse = document.getElementById('login-form__input-check--empty');
    emptyResponse.style.display = block;
}


function showPassword(e) {
    var toggle = document.getElementById('login-form__password')
    if (toggle.type === 'password') {
        toggle.type = 'text';
    }
    else {
        toggle.type = 'password';
    }
}

function openTab(e) {
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

function checkPassword(e) {
    let passwords = document.getElementsByClassName('register-form__password');
    let password1 = passwords[0];
    let password2 = passwords[1];
    let check = document.getElementById('register-form__password-check');
}



