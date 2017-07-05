/// <reference path="../node_modules/@types/systemjs/index.d.ts" />
// let swChannel: MessageChannel, appReady = false, swReady = !!navigator.serviceWorker.controller;

// if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("serviceWorker.js").then((registration) => {
//         console.log("Service Worker has been successfully registered.");
//     }).catch((err) => console.log("Error occurred while registering Service Worker:", err));
    
//     swChannel = new MessageChannel();

//     swChannel.port1.onmessage = (e) => {
//         console.log("Port1 got message from service worker:", e.data);
//     };
//     swChannel.port2.onmessage = (e) => {
//         console.log("Port2 got got message from service worker:", e.data);
//     };

//     navigator.serviceWorker.addEventListener("controllerchange", (e) => (swReady = true) && initSWData());
// }

// function initSWData(data: any = { msg: "Hello service worker!" }) {
//     !!swChannel && appReady && swReady && navigator.serviceWorker.controller.postMessage(data, [swChannel.port2]);
// }
SystemJS.config({
    map: {
        "openseadragon": "scripts/openseadragon.js",
        "leaflet": "scripts/leaflet.js"
    },
    meta: {
        "openseadragon": {
            format: "global",
            exports: "OpenSeadragon",
            esmExports: false,
        },
        "leaflet": {
            format: "global",
            exports: "L",
        }
    },
    packages: {
        "app": {
            defaultExtension: "js"
        }
    }
});

Promise.all([System.import("@angular/platform-browser-dynamic"), System.import("@angular/core"), System.import("./app/app.module")])
.then(([{ platformBrowserDynamic }, { enableProdMode }, { AppModule }]) => {
    // enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule)
        //.then(() => (appReady = true) && initSWData())
        .catch((err: any) => console.error("Application bootstrap error:", err));
});