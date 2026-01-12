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
    plugins: {
      legend: { position: "top" }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// ===== NEW: Show username and load saved vitals on page load =====
document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("name") ||"User" ; // Get logged-in user
  const greeting = document.querySelector(".welcome-text h2");  // Target <h2>
  greeting.innerText = `Hello ${username} 👋`;                  // Update greeting

  // Load saved vitals for this user
  loadVitals(username);
});
// ================================================================

window.addVitals = async function() {
    const hr = document.getElementById("heartRate").value;
    const bp = document.getElementById("bloodPressure").value;
    const spo2 = document.getElementById("spo2").value;

    if (!hr || !bp || !spo2) {
        alert("Please enter all vitals");
        return;
    }

    const time = new Date().toLocaleTimeString();

    // Update chart UI
    document.getElementById("hrValue").innerText = hr + " bpm";
    document.getElementById("bpValue").innerText = bp;
    document.getElementById("spo2Value").innerText = spo2 + " %";

    vitalChart.data.labels.push(time);
    vitalChart.data.datasets[0].data.push(hr);
    vitalChart.data.datasets[1].data.push(spo2);
    vitalChart.update();

    // ✅ POST to backend
    try {
        const res = await fetch("https://curacompanion.onrender.com/add-vitals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: sessionStorage.getItem("email"),
                heart_rate: hr,
                blood_pressure: bp,
                spo2: spo2
            })
        });
        const data = await res.json();
        if (data.error) console.error("Vitals save error:", data.error);
    } catch (err) {
        console.error("Error saving vitals:", err);
    }

    // Clear input
    document.getElementById("heartRate").value = "";
    document.getElementById("bloodPressure").value = "";
    document.getElementById("spo2").value = "";
};


// ===== NEW: Function to load saved vitals for the user =====
/*function loadVitals(username) {
  let userData = JSON.parse(localStorage.getItem(username));
  if (!userData) return;

  document.getElementById("hrValue").innerText = userData.hr[userData.hr.length - 1] + " bpm";
  document.getElementById("bpValue").innerText = userData.bp[userData.bp.length - 1];
  document.getElementById("spo2Value").innerText = userData.spo2[userData.spo2.length - 1] + " %";

  vitalChart.data.labels = userData.labels;
  vitalChart.data.datasets[0].data = userData.hr;
  vitalChart.data.datasets[1].data = userData.spo2;
  vitalChart.update();
}*/
async function loadVitals(email) {
    try {
        const res = await fetch(`https://curacompanion.onrender.com/get-vitals/${email}`);
        const data = await res.json();

        if (data.error || !data.vitals.length) return;

        const vitals = data.vitals;

        const labels = vitals.map(v => new Date(v.time).toLocaleTimeString());
        const hr = vitals.map(v => v.heart_rate);
        const spo2 = vitals.map(v => v.spo2);
        const bp = vitals.map(v => v.blood_pressure);

        document.getElementById("hrValue").innerText = hr[hr.length - 1] + " bpm";
        document.getElementById("bpValue").innerText = bp[bp.length - 1];
        document.getElementById("spo2Value").innerText = spo2[spo2.length - 1] + " %";

        vitalChart.data.labels = labels;
        vitalChart.data.datasets[0].data = hr;
        vitalChart.data.datasets[1].data = spo2;
        vitalChart.update();

    } catch (err) {
        console.error("Error loading vitals:", err);
    }
}

// =========================================================

function setReminder() {
  alert("Reminder feature coming soon! ⏰\nYou will be able to set medication and vitals reminders.");
}

function logout() {
  // Redirect to login page (change URL as needed)
  window.location.href = "/login/";
}
