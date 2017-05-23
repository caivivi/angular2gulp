const appCache = "app_cache_v1", cacheFiles = [
    'index.html',
    'modules/app/app.component.css',
    'scripts/main.js'
];

self.addEventListener("install", (e: any) => e.waitUntil(async () => {
    let cache = await caches.open(appCache);
    await cache.addAll(cacheFiles);
}));

self.addEventListener('activate', (e: any) => e.waitUntil(async () => {

}));

this.addEventListener('fetch', (e) => e.respondWith((async () => {
    let response = await caches.match(e.request);

    if (!response) {
        response = await fetch(e.request);
        let cache = await caches.open(appCache);
        cache.put(e.request, response.clone());
    }

    return response;
})()));