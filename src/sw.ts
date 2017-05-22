const appCache = "app_cache", cacheFiles = [
    'index.html',
    'modules/app/app.component.css',
    'scripts/main.js'
];

self.addEventListener("install", (e: any) => {
    e.waitUntil(async () => {
        let cache = await caches.open(appCache);
        console.log('Opendhe', cache);
        await cache.addAll(cacheFiles);
    });
});

self.addEventListener('fetch', (e: any) => {
    e.respondWith(async () => {
        let response: Response = await caches.match(e.request);

        if (!response) {
            let fetchRequest = e.request.clone();
            response = await fetch(fetchRequest);
            let responseToCache = response.clone();
            let cache = await caches.open(appCache);
            cache.put(e.request, responseToCache);
        }

        return response;
    });
});