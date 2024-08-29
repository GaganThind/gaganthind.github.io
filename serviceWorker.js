let version = '2.1';

let staticCache = `staticCache-${version}`;

const assets = ['/', '/assets/js/darkMode.js', '/assets/js/main.js', '/assets/css/main.css', '/assets/img/avatar.png', '/assets/img/favicon.png'];

const MAX_CACHE_DURATION_IN_DAYS = 1;

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
    }

    const fetchFromCacheOnly = (event) => caches.match(event.request, { ignoreSearch: true });

    const isValidCache = cachedResponse => {
        if (!cachedResponse) return false;

        const maxDate = cachedResponse.headers.get('MAX_TIME_TO_LIVE');
        if (maxDate === undefined) return false;
        return (maxDate && (parseInt(maxDate) > Date.now()));
    }

    const updateCacheFromServer = (fetchResponse, event) => {
        const type = fetchResponse.headers.get('content-type');
        if (type === null || type === undefined) return fetchResponse;

        const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
        const EXPIRATION_DATE = Date.now() + (DAY_IN_MILLISECONDS * MAX_CACHE_DURATION_IN_DAYS);
        const responseCopy = fetchResponse.clone();
        let headers = new Headers(responseCopy.headers);
        headers.append('MAX_TIME_TO_LIVE', EXPIRATION_DATE);

        caches.open(staticCache)
            .then(cache => {
                responseCopy.blob().then(body => {
                    cache.put(event.request, new Response(body, {
                        status: responseCopy.status,
                        statusText: responseCopy.statusText,
                        headers: headers
                    }));
                })
            });
    }

    const fetchFromServer = event => {
        return fetch(event.request)
            .then(
                fetchResponse => {
                    if (fetchResponse.ok) updateCacheFromServer(fetchResponse, event);
                    return fetchResponse;
                },
                fetchFromCacheOnly(event)
            )
            .catch(fetchFromCacheOnly(event));
    };

    /**
     * Check if cached response is fresh in the cache
     *      Yes, return cachedResponse
     *      No, then 
     *          check if server is online, then serve from serve
     *          else use cached expired value till server comes up
     */
    event.respondWith(
        fetchFromCacheOnly(event)
            .then(cached => isValidCache(cached) ? cached : undefined)
            .then(cached => cached || fetchFromServer(event))
    );
});