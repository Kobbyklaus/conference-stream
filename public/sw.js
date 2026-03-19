const CACHE_NAME = "conf-stream-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  // Network-first strategy — don't cache API or socket requests
  if (
    e.request.url.includes("/api/") ||
    e.request.url.includes("/socket") ||
    e.request.method !== "GET"
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
});
