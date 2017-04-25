/// <reference path="../../node_modules/@types/requirejs/index.d.ts" />
/// <reference path="../../node_modules/@types/rx/index.d.ts" />

declare const ng: {
    core: any;
    common: any;
    compiler: any;
    animations: {
        browser: any;
    };
    platformBrowser: {
        animations: any;
    };
    platformBrowserDynamic: any;
};

/**
 * Configurations
 */
const jsFolder = "scripts/", libFolder = `${jsFolder}lib/`;
requirejs.config({
    baseUrl: "/",
    waitSeconds: 1,
    paths: {
        "lodash": `${libFolder}lodash`,
        "zone": `${libFolder}zone`,
        "Rx": `${libFolder}Rx`,
        "corejs": `${libFolder}shim`,
        "angular": `${libFolder}angular`
    }
});

/**
 * Dummy Modules
 */
//rxjs
define("rxjs/Observable", ["Rx"], () => Rx);
define("rxjs/observable/merge", ["Rx"], () => Rx.Observable);
define("rxjs/operator/share", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/Subject", ["Rx"], () => Rx);
//angular
define("@angular/core", ["angular"], () => ng.core);
define("@angular/common", ["@angular/core"], () => ng.common);
define("@angular/compiler", ["@angular/core"], () => ng.compiler);
define("@angular/platform-browser", ["@angular/common", "@angular/core"], () => ng.platformBrowser);
define("@angular/platform-browser-dynamic", ["@angular/compiler", "@angular/core", "@angular/common", "@angular/platform-browser"], () => ng.platformBrowserDynamic);
//angular animation
define("@angular/animations", [], () => ng.animations);
define("@angular/animations/browser", ["@angular/animations"], () => ng.animations.browser);
define("@angular/platform-browser-animations", ["@angular/core", "@angular/platform-browser", "@angular/animations/browser"], () => ng.platformBrowser.animations);

/**
 * Main Entry
 */
define.amd = false;
requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => {
        console.log("Angular bootstraping error:", err);
    });
});