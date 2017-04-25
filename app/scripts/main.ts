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
    router: any;
};

/**
 * Configurations
 */
const jsFolder = "scripts/", libFolder = `${jsFolder}lib/`;
requirejs.config({
    baseUrl: "/",
    waitSeconds: 2,
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
define("rxjs/BehaviorSubject", ["Rx"], () => Rx);
define("rxjs/observable/from", ["Rx"], () => Rx.Observable);
define("rxjs/observable/of", ["Rx"], () => Rx.Observable);
define("rxjs/operator/concatMap", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/every", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/first", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/map", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeMap", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/reduce", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/catch", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/concatAll", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/util/EmptyError", ["Rx"], () => Rx);
define("rxjs/observable/fromPromise", ["Rx"], () => Rx.Observable);
define("rxjs/operator/last", ["Rx"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeAll", ["Rx"], () => Rx.Observable.prototype);
//angular
define("@angular/core", ["angular"], () => ng.core);
define("@angular/common", ["@angular/core"], () => ng.common);
define("@angular/compiler", ["@angular/core"], () => ng.compiler);
define("@angular/platform-browser", ["@angular/common", "@angular/core"], () => ng.platformBrowser);
define("@angular/platform-browser-dynamic", ["@angular/compiler", "@angular/core", "@angular/common", "@angular/platform-browser"], () => ng.platformBrowserDynamic);
define("@angular/router", ["@angular/common", "@angular/core", "rxjs/BehaviorSubject", "rxjs/Subject", "rxjs/observable/from", "rxjs/observable/of", "rxjs/operator/concatMap",
    "rxjs/operator/every", "rxjs/operator/first", "rxjs/operator/map", "rxjs/operator/mergeMap", "rxjs/operator/reduce", "rxjs/Observable", "rxjs/operator/catch", "rxjs/operator/concatAll",
    "rxjs/util/EmptyError", "rxjs/observable/fromPromise", "rxjs/operator/last", "rxjs/operator/mergeAll", "@angular/platform-browser", "rxjs/operator/filter"], () => ng.router);
//angular animation
define("@angular/animations", [], () => ng.animations);
define("@angular/animations/browser", ["@angular/animations"], () => ng.animations.browser);
define("@angular/platform-browser-animations", ["@angular/core", "@angular/platform-browser", "@angular/animations/browser"], () => ng.platformBrowser.animations);

/**
 * Main Entry
 */
define.amd = false;
requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error("Angular bootstraping error:", err));
});