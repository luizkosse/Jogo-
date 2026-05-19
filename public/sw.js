// Service Worker do Stardew Supremo
// Estratégia: cache-first para assets estáticos, network-first com fallback para /api/search

const CACHE_VERSION = "sds-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const SHELL_URLS = ["/", "/macetes", "/bugs", "/missoes", "/ids", "/chat", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(SHELL_URLS).catch(() => {})),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // /api/chat e /api/chat/ai NÃO cacheam (streaming, dinâmico)
  if (url.pathname.startsWith("/api/chat")) return;

  // /api/search: network-first, fallback ao cache (offline)
  if (url.pathname.startsWith("/api/search")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(API_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r ?? new Response("[]", { headers: { "Content-Type": "application/json" } }))),
    );
    return;
  }

  // Assets _next/static: cache-first (imutável com hash)
  if (url.pathname.startsWith("/_next/static") || url.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ??
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Páginas HTML: network-first com fallback ao cache do shell
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r ?? caches.match("/"))),
    );
  }
});
