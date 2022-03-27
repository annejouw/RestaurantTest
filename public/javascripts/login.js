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


