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

Promise.all([System.import("@angular/platform-browser"), System.import("@angular/core"), System.import("./app/app.module.ngfactory")])
.then(([{ platformBrowser }, { enableProdMode }, { AppModuleNgFactory }]) => {
    // enableProdMode();
    platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
        //.then(() => (appReady = true) && initSWData())
        .catch((err: any) => console.error("Application bootstrap error:", err));
});