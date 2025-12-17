function showAlert(msg) {
    const alertBox = document.querySelector('.alert-box');
    alertBox.querySelector('.alert').innerText = msg;
    alertBox.style.top = "0";

    // hide after 3 seconds
    setTimeout(() => {
        alertBox.style.top = "-100%";
    }, 3000);
}

// TEST IT
//showAlert("Hello! This is a test alert.");

window.onload = () => {
    if (sessionStorage.name && window.location.pathname === '/login'){
        location.href = '/';
    }
}


// form validation
const name = document.querySelector('.name') || null;
const email = document.querySelector('.email');
const submitBtn = document.querySelector('.submit-btn');
const password = document.querySelector('.password');

if (name == null) { // means login page is open
    submitBtn.addEventListener('click', () => {   
        fetch('/login-user', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({   
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Login DATA:", data);
            validateData(data, 'login');  // ✅ pass type
        })
        .catch(err => console.error(err));  
    });
} else { // means register page is open
    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data, 'register'); // ✅ pass type
        })
        .catch(err => console.error(err));
    });
}

const validateData = (data, type) => {
    if (!data.name) {
        // show pink alert for errors
        alertBox(data);
    } else {
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;

        // show browser popup depending on type
        if(type === 'login') {
            alert("Login successful");
        } else if(type === 'register') {
            alert("Registration successful");
        }

        location.href = '/';   // redirect to home
    }
};


const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}
