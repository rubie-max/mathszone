/* MathsZone service worker.
   Network-first for same-origin requests so the live site always wins when online
   (no stale manifest/icons/JS during active development); cache is only a fallback
   for offline. The manifest and the SW itself are never served from cache. */
const VERSION = "mz-2026-11-02f";
const SHELL = "mz-shell-" + VERSION;

const SHELL_URLS = ["./", "./index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const sameOrigin = url.origin === self.location.origin;

  // Manifest and the service worker file: always fresh from the network, never cached.
  if (sameOrigin && (url.pathname.endsWith("manifest.webmanifest") || url.pathname.endsWith("sw.js"))) {
    event.respondWith(fetch(req, { cache: "no-store" }).catch(() => caches.match(req)));
    return;
  }

  // Same-origin (incl. navigations): network-first, cache only as an offline fallback.
  if (sameOrigin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("./index.html") : undefined))
        )
    );
    return;
  }

  // Cross-origin (KaTeX, CDN fonts): stable + versioned, so cache-first is fine.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
    )
  );
});
