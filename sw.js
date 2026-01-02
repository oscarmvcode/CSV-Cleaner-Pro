const CACHE_NAME = "csv-cleaner-v3"; 

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./manifest.json",
  "./sw.js",
  // CORE & CLEANING 
  "./js/core/App.js",
  "./js/core/StateManager.js",
  "./js/core/Orchestrator.js",
  "./js/cleaning/CleanerRegistry.js",
  // UI
  "./js/ui/TableRenderer.js",
  "./js/ui/ChecklistPanel.js",
  // CLEANERS (Ruta: js/cleaning/cleaners/...)
  "./js/cleaning/cleaners/BaseCleaner.js",
  "./js/cleaning/cleaners/RemoveEmptyRows.js",
  "./js/cleaning/cleaners/NormalizeHeaders.js",
  "./js/cleaning/cleaners/NormalizeNulls.js",
  "./js/cleaning/cleaners/RemoveDuplicates.js",
  "./js/cleaning/cleaners/NormalizeDates.js",
  "./js/cleaning/cleaners/CapitalizeText.js",
  "./js/cleaning/cleaners/ValidateEmails.js",
  "./js/cleaning/cleaners/NormalizeBooleans.js",
  "./js/cleaning/cleaners/DetectOutliers.js",
  // LIBRERÍAS EXTERNAS
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css",
  "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"
];

// 1. INSTALACIÓN: Guarda los archivos esenciales en la caché
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Instalando nueva caché: " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Fuerza a que el SW nuevo se convierta en el activo inmediatamente
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Borra las cachés antiguas automáticamente
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Toma el control de las pestañas abiertas de inmediato
  self.clients.claim();
});

// 3. FETCH: Estrategia "Network First" (Intenta red, si falla usa caché)
// Esto garantiza que si hay internet, siempre bajará lo último de GitHub.
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la red responde, guardamos copia actualizada y devolvemos
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si el usuario está offline, servimos desde la caché
        return caches.match(event.request);
      })
  );
});

// 4. MENSAJE: Escucha para forzar la actualización inmediata
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});