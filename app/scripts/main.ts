/// <reference path="../../node_modules/@types/requirejs/index.d.ts" />
/// <reference path="../../node_modules/@types/rx/index.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../node_modules/zone.js/dist/zone.js.d.ts" />

/**
 * Configurations
 */
const jsFolder = "scripts/", libFolder = `${jsFolder}lib/`;
requirejs.config({
    baseUrl: "/",
    waitSeconds: 2,
    paths: {
        "lodash": `${libFolder}lodash`,
        "corejs": `${libFolder}shim`,
        "bundle": `${libFolder}bundle`
    }
});

/**
 * Main Entry
 */
requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));
});