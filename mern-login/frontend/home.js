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

function addVitals() {
  const hr = document.getElementById("heartRate").value;
  const bp = document.getElementById("bloodPressure").value;
  const spo2 = document.getElementById("spo2").value;

  if (!hr || !bp || !spo2) {
    alert("Please enter all vitals");
    return;
  }

  const time = new Date().toLocaleTimeString();

  document.getElementById("hrValue").innerText = hr + " bpm";
  document.getElementById("bpValue").innerText = bp;
  document.getElementById("spo2Value").innerText = spo2 + " %";

  vitalChart.data.labels.push(time);
  vitalChart.data.datasets[0].data.push(hr);
  vitalChart.data.datasets[1].data.push(spo2);

  vitalChart.update();

  document.getElementById("heartRate").value = "";
  document.getElementById("bloodPressure").value = "";
  document.getElementById("spo2").value = "";
}
function setReminder() {
  alert("Reminder feature coming soon! ⏰\nYou will be able to set medication and vitals reminders.");
}
function logout() {
  // Redirect to login page (change URL as needed)
  window.location.href = "/login/";
}
