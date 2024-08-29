let version = '1.1';

let staticCache = `staticCache-${version}`;
let imageCache = `imageCache-${version}`;

let assets = ['/', '/assets/js/darkMode.js', '/assets/js/main.js', '/assets/css/main.css'];
let images = ['/assets/img/avatar.png', '/assets/img/favicon.png'];

// Service worker is installed
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(staticCache)
            .then(cache => cache.addAll(assets))
            .then(() => {
                caches
                    .open(imageCache)
                    .then(cache => cache.addAll(images))
            })
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
                        .filter(key => key !== staticCache && key !== imageCache)
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
    }

    const fetchFromServer = () => {
        return fetch(event.request).then(fetchResponse => handleFetchResponse(fetchResponse, event));
    };

    const handleFetchResponse = (fetchResponse, event) => {
        const type = fetchResponse.headers.get('content-type');
        const cacheCopy = fetchResponse.clone();

        if (type && type.match(/^image\//i)) {
            return caches.open(imageCache)
                .then(cache => {
                    cache.put(event.request, cacheCopy);
                    return fetchResponse;
                });
        } else {
            return caches.open(staticCache)
                .then(cache => {
                    cache.put(event.request, cacheCopy);
                    return fetchResponse;
                });
        }
    };

    event.respondWith(
        caches
            .match(event.request)
            .then(cached => cached || fetchFromServer())
    );
});