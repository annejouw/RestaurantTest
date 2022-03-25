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

let tabLinks = document.getElementsByClassName('tab__link');
for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].addEventListener("click", openTab, false);
}

let defaultOpenTab = document.getElementById('tab__link--default')
defaultOpenTab.click();

var passwordInput = document.getElementById('login-form__checkbox');
passwordInput.addEventListener("click", showPassword, false);
