/// <reference lib="webworker" />

const CACHE_NAME = "codex-v1";
const OFFLINE_URL = "/offline";

const APP_SHELL = [
  "/",
  "/learn",
  "/offline",
  "/manifest.json",
];

// Install — cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache, then offline page
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip non-http(s) requests
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to cache it
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Cache successful navigation and asset responses
          if (
            response.status === 200 &&
            (event.request.destination === "document" ||
              event.request.destination === "script" ||
              event.request.destination === "style" ||
              event.request.destination === "image" ||
              event.request.destination === "font")
          ) {
            cache.put(event.request, clone);
          }
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) =>
            cached ||
            (event.request.destination === "document"
              ? caches.match(OFFLINE_URL)
              : new Response("", { status: 503 }))
        )
      )
  );
});

// Listen for messages to cache book content for offline reading
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_BOOK") {
    const { urls } = event.data;
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urls);
    });
  }
});
