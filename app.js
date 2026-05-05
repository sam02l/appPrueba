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

// --- SISTEMA DE LOGIN ---
window.intentarLogin = function() {
    const userIn = document.getElementById('login-user').value.trim().toLowerCase();
    const passIn = document.getElementById('login-pass').value.trim();

    // Acceso Admin
    if(userIn === "admin" && passIn === "1234") {
        mostrarPantalla("admin-view");
        cargarAdminData();
        return;
    }

    // Acceso Usuario
    get(ref(db, 'usuarios')).then((snapshot) => {
        let encontrado = false;
        snapshot.forEach((child) => {
            const d = child.val();
            if(d.usuarioWeb === userIn && d.passWeb === passIn) {
                mostrarPerfilUsuario(child.key, d);
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
    document.getElementById('perfil-acceso').innerText = data.ultimoAcceso || "Sin registros";
}

window.logout = function() { location.reload(); };

// --- FUNCIONES DE ADMINISTRADOR ---
function cargarAdminData() {
    // Historial
    onValue(query(ref(db, 'historial'), limitToLast(10)), (snapshot) => {
        const list = document.getElementById('log-list');
        list.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            list.insertAdjacentHTML('afterbegin', `
                <div class="log-entry">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-bold text-primary">${data.uid}</span>
                        <span class="text-muted" style="font-size:0.65rem">${data.timestamp}</span>
                    </div>
                    <div>${data.evento}</div>
                </div>
            `);
        });
    });

    // Lista de Usuarios
    onValue(ref(db, 'usuarios'), (snapshot) => {
        const tbody = document.getElementById('tabla-usuarios-body');
        tbody.innerHTML = "";
        snapshot.forEach((child) => {
            const uid = child.key;
            const u = child.val();
            tbody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><b>${u.nombre}</b><br><small class="text-muted">User: ${u.usuarioWeb}</small></td>
                    <td><small>${uid}</small><br><span class="badge bg-secondary">PIN: ${u.pin}</span></td>
                    <td class="text-end">
                        <button onclick="prepararEdicion('${uid}','${u.nombre}','${u.pin}','${u.usuarioWeb}','${u.passWeb}')" class="btn btn-sm btn-outline-warning">✏️</button>
                        <button onclick="eliminarUser('${uid}')" class="btn btn-sm btn-outline-danger">🗑️</button>
                    </td>
                </tr>
            `);
        });
    });
}

window.crearUsuario = function() {
    const uid = document.getElementById('uid').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim();
    const pin = document.getElementById('pin_fisico').value.trim();
    const uWeb = document.getElementById('user_web').value.trim().toLowerCase();
    const pWeb = document.getElementById('pass_web').value.trim();

    if(uid && nombre && pin && uWeb && pWeb) {
        set(ref(db, 'usuarios/' + uid), {
            nombre, pin, usuarioWeb: uWeb, passWeb: pWeb, ultimoAcceso: "Pendiente"
        }).then(() => {
            alert("Usuario sincronizado");
            document.querySelectorAll('#admin-view input').forEach(i => i.value = "");
        });
    } else { alert("Completa todos los campos"); }
};

window.prepararEdicion = function(uid, n, p, uw, pw) {
    document.getElementById('uid').value = uid;
    document.getElementById('nombre').value = n;
    document.getElementById('pin_fisico').value = p;
    document.getElementById('user_web').value = uw;
    document.getElementById('pass_web').value = pw;
};

window.eliminarUser = function(uid) { if(confirm("¿Eliminar?")) remove(ref(db, 'usuarios/' + uid)); };
window.limpiarHistorial = function() { if(confirm("¿Limpiar historial?")) remove(ref(db, 'historial')); };
window.enviarComando = function(tipo) {
    set(ref(db, 'comandos/' + tipo), true);
    setTimeout(() => set(ref(db, 'comandos/' + tipo), false), 1500);
};
