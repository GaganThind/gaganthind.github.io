const version = '2.5.1';
const staticCache = `staticCache-${version}`;

const assets = ['/', '/assets/js/main.js', '/assets/css/main.css'];

// Service worker is installed
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(staticCache)
            .then(cache => cache.addAll(assets))
            .then(self.skipWaiting())
    );
});

// Service worker is activated
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== staticCache)
                        .map(key => caches.delete(key))
                );
            })
    );
});

// Service worker intercepts fetch calls
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                return caches.open(staticCache).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});