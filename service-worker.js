const CACHE_NAME = "rfid-app-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icono-192.png",
  "./icono-512.png"
];

/* Instalación */
self.addEventListener("install", event => {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

/* Activación */
self.addEventListener("activate", event => {
  console.log("Service Worker activado");
});

/* Fetch (offline support) */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
