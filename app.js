import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- LÓGICA DE LOGIN ---
window.intentarLogin = function() {
    const userIn = document.getElementById('login-user').value.trim().toLowerCase();
    const pinIn = document.getElementById('login-pin').value.trim();

    // 1. Verificación de Administrador (Cámbialo aquí)
    if(userIn === "admin" && pinIn === "1234") {
        mostrarPantalla("admin-view");
        cargarAdminData();
        return;
    }

    // 2. Verificación de Usuario en DB
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

// --- CARGA DE DATOS PARA ADMIN (Tu código anterior adaptado) ---
function cargarAdminData() {
    // Aquí pondrías la lógica de onValue para la tabla y el historial 
    // que ya tenemos funcionando, pero solo se activa si eres admin.
    console.log("Cargando herramientas de administración...");
}

// (Sigue agregando aquí las funciones de crearUsuario, enviarComando, etc., que ya tenías)
