import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, limitToLast, query, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- MOSTRAR USUARIOS (CORREGIDO) ---
const usuariosRef = ref(db, 'usuarios/');
onValue(usuariosRef, (snapshot) => {
    const tbody = document.getElementById('tabla-usuarios-body');
    tbody.innerHTML = "";
    
    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            const uid = child.key;
            const user = child.val();
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="border-bottom border-secondary">
                    <td>
                        <div class="fw-bold">${user.nombre}</div>
                        <div class="text-muted" style="font-size: 0.7rem;">${uid}</div>
                    </td>
                    <td class="text-end">
                        <button onclick="verPin('${user.pin}')" class="btn btn-sm btn-link text-info p-1">👁️</button>
                        <button onclick="prepararEdicion('${uid}','${user.nombre}','${user.pin}')" class="btn btn-sm btn-link text-warning p-1">✏️</button>
                        <button onclick="eliminarUser('${uid}')" class="btn btn-sm btn-link text-danger p-1">🗑️</button>
                    </td>
                </tr>
            `);
        });
    } else {
        tbody.innerHTML = "<tr><td class='text-center text-muted'>No hay usuarios registrados</td></tr>";
    }
});

// --- GESTIÓN DE USUARIOS ---
window.crearUsuario = function() {
    const uid = document.getElementById('uid').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim().toUpperCase();
    const pin = document.getElementById('pin').value.trim();

    if(uid && nombre && pin.length === 4) {
        set(ref(db, 'usuarios/' + uid), { nombre, pin })
        .then(() => {
            alert("Base de datos sincronizada");
            document.getElementById('uid').value = "";
            document.getElementById('nombre').value = "";
            document.getElementById('pin').value = "";
        });
    } else {
        alert("Error: Revisa que el PIN tenga 4 números y el UID no esté vacío.");
    }
};

window.eliminarUser = function(uid) {
    if(confirm("¿Revocar acceso permanentemente?")) {
        remove(ref(db, 'usuarios/' + uid));
    }
};

window.verPin = function(pin) { alert("PIN de acceso: " + pin); };

window.prepararEdicion = function(uid, nombre, pin) {
    document.getElementById('uid').value = uid;
    document.getElementById('nombre').value = nombre;
    document.getElementById('pin').value = pin;
    window.scrollTo({ top: 500, behavior: 'smooth' });
};

// --- HISTORIAL ---
const historialRef = query(ref(db, 'historial'), limitToLast(15));
onValue(historialRef, (snapshot) => {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    snapshot.forEach((child) => {
        const data = child.val();
        list.insertAdjacentHTML('afterbegin', `
            <div class="log-entry">
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-bold text-info">${data.uid}</span>
                    <span class="timestamp">${data.timestamp}</span>
                </div>
                <div>${data.evento}</div>
            </div>
        `);
    });
});

// --- LIMPIAR HISTORIAL ---
window.limpiarHistorial = function() {
    if(confirm("¿Deseas borrar todos los registros de actividad?")) {
        remove(ref(db, 'historial'))
        .then(() => alert("Historial borrado"));
    }
};

// --- COMANDOS ---
window.enviarComando = function(tipo) {
    set(ref(db, 'comandos/' + tipo), true);
    setTimeout(() => set(ref(db, 'comandos/' + tipo), false), 1500);
    alert("Señal de " + tipo + " enviada.");
};
