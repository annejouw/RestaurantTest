function showPassword(e) {
    if (e.target.type === 'password') {
        e.target.type = 'text';
    }
    else {
        e.target.type = 'password';
    }
}

var passwordInput = document.getElementById('login-form__password');
passwordInput.addEventListener("click", showPassword, false);
