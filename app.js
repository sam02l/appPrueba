import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔴 CONFIGURA ESTO
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "pruebafirebase-a42ad.firebaseapp.com",
  databaseURL: "https://pruebafirebase-a42ad-default-rtdb.firebaseio.com",
  projectId: "pruebafirebase-a42ad",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Estado
const estadoRef = ref(db, "estado");
onValue(estadoRef, snapshot => {
  document.getElementById("estado").innerText = JSON.stringify(snapshot.val());
});

// Eventos
const eventosRef = ref(db, "eventos");
onValue(eventosRef, snapshot => {
  const data = snapshot.val();
  const ul = document.getElementById("eventos");
  ul.innerHTML = "";

  for (let key in data) {
    const li = document.createElement("li");
    li.innerText = `${data[key].tipo} - ${data[key].usuario}`;
    ul.appendChild(li);
  }
});

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
