import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, limitToLast, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0SkvCuih7IseY6FTDWkUZq38ZxYQRr9g",
    authDomain: "pruebafirebase-a42ad.firebaseapp.com",
    databaseURL: "https://pruebafirebase-a42ad-default-rtdb.firebaseio.com",
    projectId: "pruebafirebase-a42ad",
    storageBucket: "pruebafirebase-a42ad.firebasestorage.app",
    messagingSenderId: "813187669583",
    appId: "1:813187669583:web:d3cee86532217f79e1143a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- GESTIÓN DE USUARIOS (REGISTRO Y LISTA) ---

window.crearUsuario = function() {
    const uid = document.getElementById('uid').value.replace(/\s/g, '').toUpperCase();
    const nombre = document.getElementById('nombre').value.toUpperCase();
    const pin = document.getElementById('pin').value;

    if(uid && nombre && pin.length === 4) {
        set(ref(db, 'usuarios/' + uid), { nombre, pin })
        .then(() => {
            alert("✅ Usuario actualizado");
            limpiarCampos();
        });
    } else {
        alert("❌ Completa los campos (PIN de 4 números)");
    }
};

const usuariosRef = ref(db, 'usuarios');
onValue(usuariosRef, (snapshot) => {
    const tbody = document.getElementById('tabla-usuarios-body');
    tbody.innerHTML = "";
    snapshot.forEach((child) => {
        const uid = child.key;
        const user = child.val();
        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${user.nombre}</td>
                <td><small class="text-muted">${uid}</small></td>
                <td class="text-end">
                    <button onclick="verPin('${user.pin}')" class="btn btn-sm btn-outline-info">👁️</button>
                    <button onclick="prepararEdicion('${uid}','${user.nombre}','${user.pin}')" class="btn btn-sm btn-outline-warning">✏️</button>
                    <button onclick="eliminarUser('${uid}')" class="btn btn-sm btn-outline-danger">🗑️</button>
                </td>
            </tr>
        `);
    });
});

window.eliminarUser = function(uid) {
    if(confirm("¿Eliminar acceso para este UID?")) {
        set(ref(db, 'usuarios/' + uid), null);
    }
};

window.verPin = function(pin) { alert("PIN actual: " + pin); };

window.prepararEdicion = function(uid, nombre, pin) {
    document.getElementById('uid').value = uid;
    document.getElementById('nombre').value = nombre;
    document.getElementById('pin').value = pin;
    window.scrollTo({ top: 400, behavior: 'smooth' });
};

// --- MONITOR DE HISTORIAL ---

const historialRef = query(ref(db, 'historial'), limitToLast(10));
onValue(historialRef, (snapshot) => {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    snapshot.forEach((child) => {
        const data = child.val();
        list.insertAdjacentHTML('afterbegin', `
            <div class="log-entry">
                <span class="timestamp">${data.timestamp}</span><br>
                <b>${data.uid}</b>: ${data.evento}
            </div>
        `);
    });
});

// --- COMANDOS REMOTOS ---

window.enviarComando = function(tipo) {
    set(ref(db, 'comandos/' + tipo), true);
    setTimeout(() => set(ref(db, 'comandos/' + tipo), false), 2000);
    alert("Comando " + tipo + " enviado al ESP32");
};

function limpiarCampos() {
    document.getElementById('uid').value = "";
    document.getElementById('nombre').value = "";
    document.getElementById('pin').value = "";
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
