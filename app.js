import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get, remove, limitToLast, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- LOGIN ---
window.intentarLogin = function() {
    const userIn = document.getElementById('login-user').value.trim().toLowerCase();
    const pinIn = document.getElementById('login-pin').value.trim();

    if(userIn === "admin" && pinIn === "1234") {
        mostrarPantalla("admin-view");
        cargarAdminData();
        return;
    }

    const usuariosRef = ref(db, 'usuarios');
    get(usuariosRef).then((snapshot) => {
        let encontrado = false;
        snapshot.forEach((userNode) => {
            const data = userNode.val();
            if(data.nombre.toLowerCase() === userIn && data.pin === pinIn) {
                mostrarPerfilUsuario(userNode.key, data);
                encontrado = true;
            }
        });
        if(!encontrado) document.getElementById('login-error').style.display = "block";
    });
};

function mostrarPantalla(id) {
    document.getElementById('login-screen').style.display = "none";
    document.querySelectorAll('.app-content').forEach(p => p.style.display = "none");
    document.getElementById(id).style.display = "block";
}

function mostrarPerfilUsuario(uid, data) {
    mostrarPantalla("user-view");
    document.getElementById('perfil-nombre').innerText = "Hola, " + data.nombre;
    document.getElementById('perfil-uid').innerText = uid;
    document.getElementById('perfil-pin').innerText = data.pin;
}

window.logout = function() { location.reload(); };

// --- LOGICA DE ADMINISTRADOR ---
function cargarAdminData() {
    // 1. Cargar Historial
    const historialRef = query(ref(db, 'historial'), limitToLast(10));
    onValue(historialRef, (snapshot) => {
        const list = document.getElementById('log-list');
        list.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            list.insertAdjacentHTML('afterbegin', `
                <div class="log-entry">
                    <div class="d-flex justify-content-between small mb-1">
                        <span class="fw-bold text-primary">${data.uid}</span>
                        <span class="text-muted" style="font-size:0.7rem">${data.timestamp}</span>
                    </div>
                    <div class="small">${data.evento}</div>
                </div>
            `);
        });
    });

    // 2. Cargar Tabla de Usuarios
    const usuariosRef = ref(db, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
        const tbody = document.getElementById('tabla-usuarios-body');
        tbody.innerHTML = "";
        snapshot.forEach((child) => {
            const uid = child.key;
            const user = child.val();
            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><div class="fw-bold">${user.nombre}</div><div class="text-muted small" style="font-size:0.65rem">${uid}</div></td>
                    <td class="text-end">
                        <button onclick="verPin('${user.pin}')" class="btn btn-sm btn-link text-info">👁️</button>
                        <button onclick="eliminarUser('${uid}')" class="btn btn-sm btn-link text-danger">🗑️</button>
                    </td>
                </tr>
            `);
        });
    });
}

// --- ACCIONES ADMIN ---
window.crearUsuario = function() {
    const uid = document.getElementById('uid').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim().toUpperCase();
    const pin = document.getElementById('pin').value.trim();
    if(uid && nombre && pin.length === 4) {
        set(ref(db, 'usuarios/' + uid), { nombre, pin }).then(() => {
            alert("Acceso Sincronizado");
            document.getElementById('uid').value = ""; document.getElementById('nombre').value = ""; document.getElementById('pin').value = "";
        });
    }
};

window.eliminarUser = function(uid) { if(confirm("¿Borrar acceso?")) remove(ref(db, 'usuarios/' + uid)); };
window.verPin = function(pin) { alert("PIN: " + pin); };
window.limpiarHistorial = function() { if(confirm("¿Borrar historial?")) remove(ref(db, 'historial')); };
window.enviarComando = function(tipo) {
    set(ref(db, 'comandos/' + tipo), true);
    setTimeout(() => set(ref(db, 'comandos/' + tipo), false), 1500);
    alert("Comando " + tipo + " enviado");
};
