window.addEventListener("DOMContentLoaded", () => {
    const greeting = document.querySelector(".greeting");
    const logoutBtn = document.querySelector(".logout");

    // Get user name from sessionStorage
    const name = sessionStorage.getItem("name");

    // If user is not logged in, redirect to login
    if (!name) {
        window.location.href = "login.html";
        return;
    }

    // Show greeting
    greeting.textContent = `Hello ${name}`;

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();   // clear session
        window.location.href = "login.html"; // redirect to login
    });
});
