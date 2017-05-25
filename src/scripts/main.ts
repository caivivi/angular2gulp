// /// <reference path="../../node_modules/@types/requirejs/index.d.ts" />

// requirejs.config({
//     baseUrl: "/",
//     waitSeconds: 2,
//     paths: { }
// });

// requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
//     platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
// });

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

Promise.all([System.import("@angular/platform-browser-dynamic"), System.import("./modules/app/app.module")])
.then(([{ platformBrowserDynamic }, { AppModule }]) => {
    platformBrowserDynamic().bootstrapModule(AppModule)
        //.then(() => (appReady = true) && initSWData())
        .catch((err) => console.error("Application bootstrap error:", err));
});