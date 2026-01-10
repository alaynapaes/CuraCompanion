pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs/pdf.worker.js";

let pdfText = "";
let pdfReady = false;

const input = document.getElementById("chat-input");
const sendBtn = document.querySelector("#chat-input-area button");

// 🔒 Disable chat initially
input.disabled = true;
sendBtn.disabled = true;
input.placeholder = "Loading Cura Companion knowledge...";

// 🔹 LOAD PDF AUTOMATICALLY
async function loadPDF() {
  try {
    const pdf = await pdfjsLib.getDocument("care-guide.pdf").promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    pdfText = text;
    pdfReady = true;

    // ✅ Enable chat
    input.disabled = false;
    sendBtn.disabled = false;
    input.placeholder = "Ask about care, support, or resources...";

    console.log("PDF fully loaded and ready");
  } catch (err) {
    console.error("PDF load failed", err);
    input.placeholder = "Failed to load knowledge base";
  }
}

loadPDF();

// 🔹 SEND MESSAGE
async function sendMessage() {
  if (!pdfReady) return;

  const messages = document.getElementById("chat-messages");
  const userText = input.value.trim();
  if (!userText) return;

  messages.innerHTML += `<div><b>You:</b> ${userText}</div>`;
  input.value = "";

  const reply = await answerFromPDF(userText);
  messages.innerHTML += `<div><b>Cura:</b> ${reply}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

// 🔹 ANSWER ONLY FROM PDF
async function answerFromPDF(question) {
  const context = pdfText.slice(0, 2500);

  const prompt = `
You are Cura Companion.
Answer ONLY using the information below.
If the answer is not present, say "I don't have that information."

CONTENT:
${context}

QUESTION:
${question}
`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
           "I don't have that information.";
  } catch {
    return "AI service temporarily unavailable.";
  }
}
