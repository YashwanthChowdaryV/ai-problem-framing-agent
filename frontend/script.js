// ================= API =================
const API_URL = "https://haleigh-nonextendible-unduteously.ngrok-free.dev/analyze";

// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: "AIzaSyCNw-IzIfNSs2hXKnU4_Jh3kqSEUYAupZA",
  authDomain: "aiagent-a0a84.firebaseapp.com",
  projectId: "aiagent-a0a84"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================= ANALYZE =================
document.getElementById("analyzeBtn").addEventListener("click", analyzeProblem);

async function analyzeProblem() {
  const text = document.getElementById("problemInput").value;
  const output = document.getElementById("output");

  if (!text.trim()) {
    alert("Please enter a problem description");
    return;
  }

  output.textContent = "Analyzing...";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_text: text })
  });

  const data = await response.json();
  renderOutput(data);
  loadHistory();
}

// ================= OUTPUT =================
function renderOutput(data) {
  document.getElementById("output").textContent =
`Domain:
${data.Domain}

Problem Type:
${data["Problem Type"]}

Core Problem:
${data["Core Problem"]}

Confidence Score:
${data["Confidence Score"]}

Semantic Consistency:
${data["Semantic Consistency"]}

Well-Framed Problem Statement:
${data["Well-Framed Problem Statement"]}`;
}

// ================= HISTORY (🔥 FIXED) =================
async function loadHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  try {
    const snapshot = await db
      .collection("problem_frames")
      .orderBy("timestamp", "desc")
      .get();

    if (snapshot.empty) {
      historyDiv.textContent = "No history available.";
      return;
    }

    snapshot.forEach(doc => {
      const item = doc.data();

      const div = document.createElement("div");
      div.className = "history-item";
      div.textContent = item.input.slice(0, 100) + "...";

      div.onclick = () => renderOutput(item.output);
      historyDiv.appendChild(div);
    });

  } catch (error) {
    historyDiv.textContent = "Error loading history.";
    console.error(error);
  }
}

// ================= INIT =================
loadHistory();
