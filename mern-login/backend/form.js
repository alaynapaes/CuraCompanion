function showAlert(msg) {
    const alertBox = document.querySelector('.alert-box');
    alertBox.querySelector('.alert').innerText = msg;
    alertBox.style.top = "0";

    setTimeout(() => {
        alertBox.style.top = "-100%";
    }, 3000);
}

// 🔒 Prevent logged-in users from seeing login page
window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("name") && window.location.pathname === "/login") {
        window.location.href = "/";
    }
});

// form elements
const nameInput = document.querySelector('.name'); // signup only
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

// 👉 LOGIN PAGE
if (!nameInput) {
    submitBtn.addEventListener('click', () => {
fetch('https://curacompanion.onrender.com/login-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
        .catch(err => console.error(err));
    });
}

// 👉 SIGNUP PAGE
else {
    submitBtn.addEventListener('click', () => {
fetch('https://curacompanion.onrender.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
        .catch(err => console.error(err));
    });
}

// ✅ HANDLE SERVER RESPONSE
function validateData(data) {
    if (data.error) {
        showAlert(data.error);
        return;
    }

    // ✅ SAVE USER SESSION
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("email", data.email);

    // ✅ REDIRECT TO HOME
    window.location.href = "/";
}
