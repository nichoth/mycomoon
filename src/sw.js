// console.log('sw things')

// * check if we have the rousources for the site
// * fetch missing resources
// * check that resources are up-to-date

// https://medium.com/samsung-internet-dev/pwa-series-service-workers-the-basics-about-offline-a6e8f1d92dfd

// Perform install steps
let CACHE_NAME = 'my-cache'
let urlsToCache = [
    '/index.html',

    '/style.css',
    '/style.css.map',
    '/bundle.js',

    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/icon.png',
    '/myco.png'
]

self.addEventListener('install', function (ev) {
    // Perform install steps
    console.log('**install event**', ev)

    ev.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('**Opened cache**', cache)
            return cache.addAll(urlsToCache)
        })
    )
})

// This works great for static content but if we have dynamic content,
// it will never be updated.
self.addEventListener('fetch', function (ev) {
    ev.respondWith(caches.match(ev.request)
            .then(function (response) {
                console.log('**cache hit', response)
                // Cache hit - return response
                if (response) return response
                return fetch(ev.request)
            })
            .catch(err => console.log('!!!!err!! here', err))
    )
})

// the browser will check if these resources are in the previous cache
// list. if they don’t exist anymore it will remove them.
self.addEventListener('activate', function (ev) {
    console.log('activate', ev)
    var cacheWhitelist = ['my-cache']

    ev.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    console.log('cache name', cacheName)
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('***missing cache item', cacheName)
                        return caches.delete(cacheName)
                    }
            }))
        })
    )
})
