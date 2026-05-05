// Importamos las funciones necesarias de los servidores de Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, limitToLast, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Tus credenciales reales
const firebaseConfig = {
    apiKey: "AIzaSyB0SkvCuih7IseY6FTDWkUZq38ZxYQRr9g",
    authDomain: "pruebafirebase-a42ad.firebaseapp.com",
    databaseURL: "https://pruebafirebase-a42ad-default-rtdb.firebaseio.com",
    projectId: "pruebafirebase-a42ad",
    storageBucket: "pruebafirebase-a42ad.firebasestorage.app",
    messagingSenderId: "813187669583",
    appId: "1:813187669583:web:d3cee86532217f79e1143a"
};

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- HACER LAS FUNCIONES DISPONIBLES PARA EL HTML ---
// Usamos 'window.' para que los botones con 'onclick' puedan verlas
window.crearUsuario = function() {
    const uid = document.getElementById('uid').value.replace(/\s/g, '').toUpperCase();
    const nombre = document.getElementById('nombre').value.toUpperCase();
    const pin = document.getElementById('pin').value;

    if(uid && nombre && pin.length === 4) {
        set(ref(db, 'usuarios/' + uid), { nombre, pin })
        .then(() => {
            alert("✅ Sincronizado con éxito");
            document.getElementById('uid').value = "";
            document.getElementById('nombre').value = "";
            document.getElementById('pin').value = "";
        });
    } else {
        alert("❌ Datos incompletos o PIN incorrecto");
    }
};

window.enviarComando = function(tipo) {
    set(ref(db, 'comandos/' + tipo), true);
    setTimeout(() => set(ref(db, 'comandos/' + tipo), false), 2000);
};

// --- MONITOR DE HISTORIAL ---
const historialRef = query(ref(db, 'historial'), limitToLast(10));
onValue(historialRef, (snapshot) => {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    snapshot.forEach((child) => {
        const data = child.val();
        const html = `
            <div class="log-entry" style="border-left: 3px solid #00d4ff; padding-left: 10px; margin-bottom: 12px;">
                <span style="color: #00d4ff; font-weight: bold; font-size: 0.8rem;">${data.timestamp}</span><br>
                <b>${data.uid}</b>: ${data.evento}
            </div>`;
        list.insertAdjacentHTML('afterbegin', html);
    });
});
