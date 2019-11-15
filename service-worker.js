const staticCacheName = 'dodycode-premiere-league-v1';

let urlToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/partials/nav.html',
    '/pages/klasemen.html',
    '/pages/favorit.html',
    '/pages/tim.html',
    '/assets/css/materialize.min.css',
    '/assets/js/materialize.min.js',
    '/assets/css/app.css',
    '/assets/js/api.js',
    '/assets/js/app.js',
    '/assets/js/nav.js',
    '/assets/js/dbhelper.js',
    '/assets/js/idb.js',
    '/assets/img/icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => cache.addAll(urlToCache))
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != staticCacheName) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    let requestUrl = new URL(event.request.url);
    let proxy = 'https://cors-anywhere.herokuapp.com/';


    if (event.request.url.indexOf('https://upload.wikimedia.org/') > -1) {
        event.respondWith(serveApiData(event.request, requestUrl));
        return;
    }

    if (event.request.url.indexOf(proxy) > -1) {
        event.respondWith(serveApiData(event.request, requestUrl));
        return;
    }

    event.respondWith(
        caches
        .match(event.request, { cacheName: staticCacheName })
        .then(function(response) {
            if (response) {
                console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                return response;
            }

            console.log(
                "ServiceWorker: Mendownload aset dari server: ",
                event.request.url
            );
            return fetch(event.request);
        })
    );

});

const serveApiData = (request, requestUrl) => {
    return caches.open(staticCacheName).then(cache => {
        return cache.match(requestUrl).then(response => {
            if (response) {
                console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                return response;
            }

            
            return fetch(request).then(networkResponse => {
                cache.put(requestUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
};

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});