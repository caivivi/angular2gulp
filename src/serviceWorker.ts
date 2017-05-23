const appCache = "app_cache_v1", cacheFiles = [
    'index.html',
    'modules/app/app.component.css',
    'scripts/main.js',
    "modules/list/list.component.css"
];

self.addEventListener("install", (e: any) => e.waitUntil((async () => {
    let cache = await caches.open(appCache);
    await cache.addAll(cacheFiles);
})()));

self.addEventListener("activate", (e: any) => e.waitUntil((async () => {
    await (<any>self).clients.claim();
})()));

self.addEventListener("fetch", (e: any) => e.respondWith((async () => {
    let response: Response = await caches.match(e.request);

    if (!response) {
        response = await fetch(e.request);
        let cache = await caches.open(appCache);
        cache.put(e.request, response.clone());
    }

    return response;
})()));

self.addEventListener("message", (e) => {
    console.log("Service Worker received a message from page:", e.data, e.ports);

    e.ports.length && e.ports.forEach((port) => {
        port.postMessage({ msg: "Send message back to window", previousData: e.data });
    });
});