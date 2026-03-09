const CACHE_NAME = 'app-shell-v1';

const APP_SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './translator.js',
  './models.js',
  './storage.js',
  './translator-worker.js',
  '../favicon.png',
];

const BERGAMOT_VERSION = '0.4.9';
const BERGAMOT_BASE = `https://cdn.jsdelivr.net/npm/@browsermt/bergamot-translator@${BERGAMOT_VERSION}/worker`;
const CDN_FILES = [
  `${BERGAMOT_BASE}/translator-worker.js`,
  `${BERGAMOT_BASE}/bergamot-translator-worker.js`,
  `${BERGAMOT_BASE}/bergamot-translator-worker.wasm`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== 'translation-models-v1')
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Don't intercept model file downloads (handled by the app's own Cache API store)
  if (url.includes('storage.googleapis.com') || url.includes('models/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache CDN resources on first fetch
        if (CDN_FILES.some((f) => url === f)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
