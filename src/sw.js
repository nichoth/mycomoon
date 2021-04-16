// console.log('sw things')

// * check if we have the rousources for the site
// * fetch missing resources
// * check that resources are up-to-date

// https://medium.com/samsung-internet-dev/pwa-series-service-workers-the-basics-about-offline-a6e8f1d92dfd
// https://www.smashingmagazine.com/2016/02/making-a-service-worker/

// Perform install steps
let CACHE_NAME = 'my-cache'
let urlsToCache = [
    // '/index.html',
    '/Casta-Regular.otf',
    'myco.webmanifest',

    '/style.css',
    '/style.css.map',
    '/bundle.js',

    'favicon.ico',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/icon.png',
    '/myco.png'
]

self.addEventListener('install', function (ev) {
    // Perform install steps -- cache all our urls right away
    console.log('**install event**', ev)

    ev.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('**Opened cache**', cache, CACHE_NAME)
            return cache.addAll(urlsToCache)
        })
    )
})

// This works great for static content but if we have dynamic content,
// it will never be updated.
self.addEventListener('fetch', function (ev) {
    // below is based on the content type --
    // using fetch-first for content, cache for static

    console.log('fetch ev', ev)

    var { request } = ev
    var acceptHeader = request.headers.get('Accept')
    console.log('acceptHeader', acceptHeader)
    var cacheKey = 'static'

    if ((acceptHeader || '').indexOf('text/html') !== -1) {
        cacheKey = 'content';
    } else if ((acceptHeader || '').indexOf('image') !== -1) {
        cacheKey = 'image';
    }

    var resourceType = cacheKey;

    // 1. Determine what kind of asset this is… (above).
    if (resourceType === 'content') {
        console.log('**content**', request)
        // Use a network-first strategy.
        ev.respondWith(
            fetch(request)
                .then(response => {
                    console.log('fetching', response)
                    return addToCache(CACHE_NAME, request, response)
                })
                .catch((err) => {
                    console.log('errrrr', err)
                    return fetchFromCache(ev)
                })
                // .catch(() => offlineResponse(opts))
        );
    } else {
        // Use a cache-first strategy.
        ev.respondWith(
            fetchFromCache(ev)
            .catch(() => fetch(request))
            .then(response => addToCache(CACHE_NAME, request, response))
            // .catch(() => offlineResponse(resourceType, opts))
        )
    }

})



function addToCache (cacheKey, request, response) {
    console.log('adding', cacheKey, response)
    if (response.ok) {
        var copy = response.clone()
        caches.open(cacheKey).then(cache => {
            cache.put(request, copy)
        })
    }
    return response
}

function fetchFromCache (ev) {
    return caches.match(ev.request).then(response => {
        if (!response) {
            // A synchronous error that will kick off the catch handler
            throw Error(`${ev.request.url} not found in cache`)
        }
        console.log('got from cache', ev.request, response)
        return response
    })
}


// the browser will check if these resources are in the previous cache
// list. if they don’t exist anymore it will remove them.
self.addEventListener('activate', function (ev) {
    console.log('**activate', ev)
    // var cacheWhitelist = ['my-cache', 'static', 'content', 'image']
    var cacheWhitelist = [CACHE_NAME]

    // rm caches not in 'whitelist'
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
