// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔴 PEGA AQUÍ TU CONFIG DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "pruebafirebase-a42ad.firebaseapp.com",
  databaseURL: "https://pruebafirebase-a42ad-default-rtdb.firebaseio.com",
  projectId: "pruebafirebase-a42ad",
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================
// VER ESTADO
// ============================
const estadoRef = ref(db, "estado");

onValue(estadoRef, (snapshot) => {
  const data = snapshot.val();
  document.getElementById("estado").innerText =
    data ? JSON.stringify(data, null, 2) : "Sin datos";
});

// ============================
// VER EVENTOS
// ============================
const eventosRef = ref(db, "eventos");

onValue(eventosRef, (snapshot) => {
  const data = snapshot.val();
  const lista = document.getElementById("eventos");

  lista.innerHTML = "";

  if (!data) return;

  Object.keys(data).reverse().forEach(key => {
    const evento = data[key];

    const li = document.createElement("li");
    li.textContent = `${evento.tipo} - ${evento.usuario || "?"}`;
    lista.appendChild(li);
  });
});

// ============================
// BOTÓN DE PRUEBA
// ============================
window.crearEvento = function () {
  push(eventosRef, {
    tipo: "PRUEBA_WEB",
    usuario: "admin",
    timestamp: Date.now()
  });
};
