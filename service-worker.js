import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lista = document.getElementById("eventos");

// 🔄 Cargar eventos
async function cargarEventos() {
  lista.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "eventos"));

  querySnapshot.forEach((docu) => {
    const data = docu.data();

    const li = document.createElement("li");
    li.textContent = `${data.fecha} - ${data.tipo} - ${data.usuario}`;

    lista.appendChild(li);
  });
}

cargarEventos();

// 🔐 Cambiar PIN
window.cambiarPIN = async () => {
  const usuario = document.getElementById("usuario").value;
  const nuevoPin = document.getElementById("nuevoPin").value;

  const querySnapshot = await getDocs(collection(db, "usuarios"));

  querySnapshot.forEach(async (docu) => {
    if (docu.data().nombre === usuario) {
      await updateDoc(doc(db, "usuarios", docu.id), {
        pin: nuevoPin
      });
      alert("PIN actualizado");
    }
  });
};
