const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "pruebafirebase-a42ad.firebaseapp.com",
    databaseURL: "https://pruebafirebase-a42ad-default-rtdb.firebaseio.com",
    projectId: "pruebafirebase-a42ad",
    storageBucket: "pruebafirebase-a42ad.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Escuchar Historial
db.ref('historial').limitToLast(15).on('value', (snap) => {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    snap.forEach((child) => {
        const val = child.val();
        list.insertAdjacentHTML('afterbegin', `
            <div class="log-entry">
                <span class="timestamp">${val.timestamp}</span><br>
                <b>${val.uid}</b>: ${val.evento}
            </div>
        `);
    });
});

// Crear Usuario
function crearUsuario() {
    const uid = document.getElementById('uid').value.replace(/\s/g, '').toUpperCase();
    const nombre = document.getElementById('nombre').value.toUpperCase();
    const pin = document.getElementById('pin').value;

    if(uid && nombre && pin.length == 4) {
        db.ref('usuarios/' + uid).set({ nombre, pin })
        .then(() => alert("Usuario " + nombre + " sincronizado."));
    } else {
        alert("Llena todos los campos correctamente.");
    }
}

// Comandos Remotos
function comando(tipo) {
    db.ref('comandos/' + tipo).set(true);
    setTimeout(() => db.ref('comandos/' + tipo).set(false), 2000);
}

// Registro de Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
