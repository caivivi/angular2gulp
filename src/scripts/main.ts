// /// <reference path="../../node_modules/@types/requirejs/index.d.ts" />

// requirejs.config({
//     baseUrl: "/",
//     waitSeconds: 2,
//     paths: { }
// });

// requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
//     platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
// });

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("serviceWorker.js").then((registration) => {
        console.log("ServiceWorker has been successfully registered", registration);
    }).catch((err) => console.log("ServiceWorker registration failed", err));

    if (navigator.serviceWorker.controller) {
        let serviceWorkerChannel = new MessageChannel();

        serviceWorkerChannel.port1.addEventListener("message", (e) => {
            console.log("Port1 got message from service worker", e.data);
        });

        serviceWorkerChannel.port2.addEventListener("message", (e) => {
            console.log("Port2 got got message from service worker", e.data);
        });

        navigator.serviceWorker.controller.postMessage({ msg: "Hello service worker!" }, [serviceWorkerChannel.port2]);
    }
}

Promise.all([System.import("@angular/platform-browser-dynamic"), System.import("./modules/app/app.module")])
.then(([{ platformBrowserDynamic }, { AppModule }]) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
});