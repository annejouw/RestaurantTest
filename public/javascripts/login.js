function showPassword(e) {
    var toggle = document.getElementById('login-form__password')
    if (toggle.type === 'password') {
        toggle.type = 'text';
    }
    else {
        toggle.type = 'password';
    }
}

var passwordInput = document.getElementById('login-form__checkbox');
passwordInput.addEventListener("click", showPassword, false);
