const version = '2.4.6';
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

// Service worker intercepts a fetch call
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        // Don't intercept non-GET requests
        return;
    };

    const fetchFromServer = () => {
        return fetch(event.request).then(fetchResponse => handleFetchResponse(fetchResponse, event));
    };

    const handleFetchResponse = (fetchResponse, event) => {
        return caches.open(staticCache)
            .then(cache => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            });
    };

    event.respondWith(
        caches
            .match(event.request)
            .then(cached => cached || fetchFromServer())
    );
});