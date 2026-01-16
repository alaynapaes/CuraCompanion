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
function loadVitals(email) {
    fetch(`http://localhost:3000/get-vitals/${email}`)
        .then(res => res.json())
        .then(data => {
            if (!data.vitals || data.vitals.length === 0) return;

            vitalChart.data.labels = data.vitals.map(v =>
                new Date(v.time).toLocaleTimeString()
            );

            vitalChart.data.datasets[0].data = data.vitals.map(v => v.heart_rate);
            vitalChart.data.datasets[1].data = data.vitals.map(v => v.spo2);

            const last = data.vitals[data.vitals.length - 1];
            document.getElementById("hrValue").innerText = last.heart_rate + " bpm";
            document.getElementById("bpValue").innerText = last.blood_pressure;
            document.getElementById("spo2Value").innerText = last.spo2 + " %";

            vitalChart.update();
        })
        .catch(err => console.error("Error loading vitals:", err));
}



    // Load vitals for the currently logged-in user
    loadVitals(email);

    // ===== Add vitals function =====
window.addVitals = async function () {
    const hr = document.getElementById("heartRate").value;
    const bp = document.getElementById("bloodPressure").value;
    const spo2 = document.getElementById("spo2").value;

    if (!hr || !bp || !spo2) {
        alert("Please enter all vitals");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/add-vitals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                heart_rate: hr,
                blood_pressure: bp,
                spo2
            })
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        // ✅ Reload from DB after save
        loadVitals(email);

        document.getElementById("heartRate").value = "";
        document.getElementById("bloodPressure").value = "";
        document.getElementById("spo2").value = "";

    } catch (err) {
        console.error("Error saving vitals:", err);
    }
};


    // ===== Logout functionality =====
    logoutBtn.addEventListener("click", () => {
        sessionStorage.clear(); // clear session
        window.location.href = "login.html"; // redirect to login
    });
});
