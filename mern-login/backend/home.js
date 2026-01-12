/*window.addEventListener("DOMContentLoaded", () => {
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
});*/

/*
window.addEventListener("DOMContentLoaded", () => {
    // ===== Select elements =====
    const greeting = document.querySelector(".greeting");
    const logoutBtn = document.querySelector(".logout");

    // ===== Get logged-in user =====
    const name = sessionStorage.getItem("name");
    if (!name) {
        alert("Please login or signup first");
        window.location.href = "login.html";
        return;
    }

    // ===== Show greeting =====
    greeting.textContent = `Hello ${name} 👋`;

    
    // ===== Logout functionality =====
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear(); // clear session
        window.location.href = "login.html"; // redirect to login
    });
});
*/


window.addEventListener("DOMContentLoaded", () => {
    const greeting = document.querySelector(".greeting");
    const logoutBtn = document.querySelector(".logout");

    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");

    // 🔐 Protect home page
    if (!name || !email) {
        window.location.replace("login.html");
        return;
    }

    // 👋 Show correct user every time
    greeting.textContent = `Hello ${name} 👋`;

    // ===== Initialize Chart =====
    const ctx = document.getElementById("vitalChart").getContext("2d");
    const vitalChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Heart Rate (bpm)",
                    data: [],
                    borderColor: "#e53935",
                    tension: 0.4
                },
                {
                    label: "SpO2 (%)",
                    data: [],
                    borderColor: "#43a047",
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "top" } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // ===== Load saved vitals for this user =====
    function loadVitals(userEmail) {
        const userData = JSON.parse(localStorage.getItem(userEmail));
        if (!userData) return;

        document.getElementById("hrValue").innerText = userData.hr[userData.hr.length - 1] + " bpm";
        document.getElementById("bpValue").innerText = userData.bp[userData.bp.length - 1];
        document.getElementById("spo2Value").innerText = userData.spo2[userData.spo2.length - 1] + " %";

        vitalChart.data.labels = userData.labels;
        vitalChart.data.datasets[0].data = userData.hr;
        vitalChart.data.datasets[1].data = userData.spo2;
        vitalChart.update();
    }

    // Load vitals for the currently logged-in user
    loadVitals(email);

    // ===== Add vitals function =====
    window.addVitals = function() {
        const hr = document.getElementById("heartRate").value;
        const bp = document.getElementById("bloodPressure").value;
        const spo2 = document.getElementById("spo2").value;

        if (!hr || !bp || !spo2) {
            alert("Please enter all vitals");
            return;
        }

        const time = new Date().toLocaleTimeString();

        // Update UI
        document.getElementById("hrValue").innerText = hr + " bpm";
        document.getElementById("bpValue").innerText = bp;
        document.getElementById("spo2Value").innerText = spo2 + " %";

        // Update chart
        vitalChart.data.labels.push(time);
        vitalChart.data.datasets[0].data.push(hr);
        vitalChart.data.datasets[1].data.push(spo2);
        vitalChart.update();

        // Save vitals per user in localStorage
        let userData = JSON.parse(localStorage.getItem(email)) || { labels: [], hr: [], spo2: [], bp: [] };
        userData.labels.push(time);
        userData.hr.push(hr);
        userData.spo2.push(spo2);
        userData.bp.push(bp);
        localStorage.setItem(email, JSON.stringify(userData));

        // Clear input fields
        document.getElementById("heartRate").value = "";
        document.getElementById("bloodPressure").value = "";
        document.getElementById("spo2").value = "";
    };

    // ===== Logout functionality =====
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear(); // clear session
        window.location.href = "login.html"; // redirect to login
    });
});
