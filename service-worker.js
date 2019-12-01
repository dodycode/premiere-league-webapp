importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const staticCacheName = 'dodycode-premiere-league-v1';

let urlToCache = [
    {url: '/', revision: 1},
    {url: '/index.html', revision: 1},
    {url: '/manifest.json', revision: 1},
    {url: '/push.js', revision: 1},
    {url: '/partials/nav.html', revision: 1},
    {url: '/pages/klasemen.html', revision: 1},
    {url: '/pages/favorit.html', revision: 1},
    {url: '/pages/tim.html', revision: 1},
    {url: '/assets/css/materialize.min.css', revision: 1},
    {url: '/assets/js/materialize.min.js', revision: 1},
    {url: '/assets/css/app.css', revision: 1},
    {url: '/assets/js/api.js', revision: 1},
    {url: '/assets/js/app.js', revision: 1},
    {url: '/assets/js/nav.js', revision: 1},
    {url: '/assets/js/dbhelper.js', revision: 1},
    {url: '/assets/js/idb.js', revision: 1},
    {url: '/assets/img/icon.png', revision: 1}
];

let proxy = 'https://cors-anywhere.herokuapp.com/';

let imageUrl = 'https://upload.wikimedia.org/';


if(workbox) {
    workbox.precaching.precacheAndRoute(urlToCache);

    workbox.routing.registerRoute(
      new RegExp(proxy),
      workbox.strategies.staleWhileRevalidate({
        cacheName: staticCacheName
      })
    );

    workbox.routing.registerRoute(
      new RegExp(imageUrl),
      workbox.strategies.staleWhileRevalidate({
        cacheName: staticCacheName
      })
    );
}else{
    console.error('Workbox gagal dimuat!');
}

// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(staticCacheName).then(cache => cache.addAll(urlToCache))
//     );
// });

// self.addEventListener("activate", function(event) {
//     event.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function(cacheName) {
//                     if (cacheName != staticCacheName) {
//                         console.log("ServiceWorker: cache " + cacheName + " dihapus");
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// self.addEventListener('fetch', event => {
//     let requestUrl = new URL(event.request.url);
//     let proxy = 'https://cors-anywhere.herokuapp.com/';


//     if (event.request.url.indexOf('https://upload.wikimedia.org/') > -1) {
//         event.respondWith(serveApiData(event.request, requestUrl));
//         return;
//     }

//     if (event.request.url.indexOf(proxy) > -1) {
//         event.respondWith(serveApiData(event.request, requestUrl));
//         return;
//     }

//     event.respondWith(
//         caches
//         .match(event.request, { cacheName: staticCacheName })
//         .then(function(response) {
//             if (response) {
//                 console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
//                 return response;
//             }

//             console.log(
//                 "ServiceWorker: Mendownload aset dari server: ",
//                 event.request.url
//             );
//             return fetch(event.request);
//         })
//     );

// });

// const serveApiData = (request, requestUrl) => {
//     return caches.open(staticCacheName).then(cache => {
//         return cache.match(requestUrl).then(response => {
//             if (response) {
//                 console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
//                 return response;
//             }


//             return fetch(request).then(networkResponse => {
//                 cache.put(requestUrl, networkResponse.clone());
//                 return networkResponse;
//             });
//         });
//     });
// };

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'assets/img/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});