window.onload = () => {
    const greeting = document.querySelector('.greeting');
    const logout = document.querySelector('.logout');

    // Redirect to login if not logged in
    if (!sessionStorage.name) {
        location.href = '/login';
        return;
    }

    // Show greeting
    greeting.innerHTML = `Hello ${sessionStorage.name}`;

    // Logout button
    logout.onclick = () => {
        sessionStorage.clear();
        location.href = '/login'; // redirect to login
    };
};
