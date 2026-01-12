/*loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const res = await fetch("https://curacompanion.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (res.ok) {
            sessionStorage.removeItem("name");
            sessionStorage.setItem("name", data.name);
            sessionStorage.setItem("email", data.email);

            window.location.replace("home.html");
        } else {
            alert(data.error || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});*/

console.log("LOGIN JS LOADED");

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

    try {
        const res = await fetch("/login-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        // ❌ LOGIN FAILED
        if (data.error) {
            alert(data.error); // 🔔 popup
            return;
        }

        // ✅ LOGIN SUCCESS
        sessionStorage.clear();
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("email", data.email);

        alert("Login successful.");

        window.location.replace("home.html");

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});
