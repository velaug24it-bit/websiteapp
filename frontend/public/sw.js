// Service Worker for Velan Kadalai Mittai PWA
// Version: v3 (Includes failsafe SPA navigation fallback to prevent 404 Not Found on page refresh)
const CACHE_NAME = 'velan-kadalai-mittai-cache-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install event - Pre-cache core SPA shell and static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Pre-cache individual assets so a failure on one does not block the others
      await Promise.all(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] Could not precache:', asset, err);
          })
        )
      );
    })
  );
  // Force active immediately without waiting for existing tabs to close
  self.skipWaiting();
});

// Activate event - Immediately purge older caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Navigation fallback & Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass Service Worker for backend API endpoints and third-party gateways (Razorpay, Render)
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('razorpay') ||
    url.hostname.includes('onrender') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // 2. Navigation requests (Page reload, deep link, or direct URL entry on mobile PWA / PC)
  // ALWAYS return index.html so React Router handles the route client-side without "Not Found" error
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Attempt network fetch
          const networkResponse = await fetch(event.request);

          // If the server returned a valid 200 OK response, clone to cache and return
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('/index.html', networkResponse.clone());
            return networkResponse;
          }

          // If server returned 404 Not Found or any non-200 code (common on SPA deep links upon refresh):
          // Immediately fallback to cached index.html so React Router takes over smoothly!
          const cachedShell =
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          if (cachedShell) {
            return cachedShell;
          }

          // If not in cache yet, fetch root /index.html directly from the network
          const rootFallback = await fetch('/index.html');
          if (rootFallback && rootFallback.status === 200) {
            return rootFallback;
          }

          return networkResponse;
        } catch (err) {
          // Offline, airplane mode, or network drop: serve cached index.html
          const cachedShell =
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          if (cachedShell) {
            return cachedShell;
          }

          // Last-resort fallback
          try {
            return await fetch('/index.html');
          } catch (e) {
            return new Response('App Offline. Please reconnect to internet.', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' },
            });
          }
        }
      })()
    );
    return;
  }

  // 3. Static assets (JS, CSS, icons, images, fonts): Stale while revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
