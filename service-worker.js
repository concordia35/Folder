const CACHE_NAME = "concordia-folder-v11";
const CORE_ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js", "./arrangementer.json",
  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./apple-touch-icon.png", "./favicon-32.png", "./logo.png", "./qrv1.png",
  "./billede2_bibliotekstue.webp", "./billede3_rundtbord.webp",
  "./billede4_samtale.webp", "./billede6_velgorenhed.webp",
  "./oktoberfest.webp", "./samtale.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return cache.match(request);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith("/arrangementer.json")) {
    event.respondWith(networkFirst(event.request));
  } else if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request).then(response => response || caches.match("./index.html")));
  } else {
    event.respondWith(cacheFirst(event.request));
  }
});
