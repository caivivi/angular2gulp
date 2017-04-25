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
    http: any;
    forms: any;
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
        "corejs": `${libFolder}shim`,
        "angular": `${libFolder}angular`
    }
});

/**
 * Dummy Modules
 */
//rxjs
define("rxjs/Observable", ["angular"], () => Rx);
define("rxjs/observable/merge", ["angular"], () => Rx.Observable);
define("rxjs/operator/share", ["angular"], () => Rx.Observable.prototype);
define("rxjs/Subject", ["angular"], () => Rx);
define("rxjs/BehaviorSubject", ["angular"], () => Rx);
define("rxjs/observable/from", ["angular"], () => Rx.Observable);
define("rxjs/observable/of", ["angular"], () => Rx.Observable);
define("rxjs/operator/concatMap", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/every", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/first", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/map", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeMap", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/reduce", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/catch", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/concatAll", ["angular"], () => Rx.Observable.prototype);
define("rxjs/util/EmptyError", ["angular"], () => Rx);
define("rxjs/observable/fromPromise", ["angular"], () => Rx.Observable);
define("rxjs/operator/last", ["angular"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeAll", ["angular"], () => Rx.Observable.prototype);
define("rxjs/observable/forkJoin", ["angular"], () => Rx.Observable);
define("rxjs/operator/filter", ["angular"], () => Rx.Observable.prototype);
//angular
define("@angular/core", ["angular"], () => ng.core);
define("@angular/common", ["@angular/core"], () => ng.common);
define("@angular/compiler", ["@angular/core"], () => ng.compiler);
define("@angular/platform-browser", ["@angular/common", "@angular/core"], () => ng.platformBrowser);
define("@angular/platform-browser-dynamic", ["@angular/compiler", "@angular/core", "@angular/common", "@angular/platform-browser"], () => ng.platformBrowserDynamic);
define("@angular/router", ["@angular/common", "@angular/core", "rxjs/BehaviorSubject", "rxjs/Subject", "rxjs/observable/from", "rxjs/observable/of", "rxjs/operator/concatMap",
    "rxjs/operator/every", "rxjs/operator/first", "rxjs/operator/map", "rxjs/operator/mergeMap", "rxjs/operator/reduce", "rxjs/Observable", "rxjs/operator/catch", "rxjs/operator/concatAll",
    "rxjs/util/EmptyError", "rxjs/observable/fromPromise", "rxjs/operator/last", "rxjs/operator/mergeAll", "@angular/platform-browser", "rxjs/operator/filter"], () => ng.router);
define("@angular/http", ["@angular/core", "rxjs/Observable", "@angular/platform-browser"], () => ng.http);
define("@angular/forms", ["@angular/core", "rxjs/observable/forkJoin", "rxjs/observable/fromPromise", "rxjs/operator/map", "@angular/platform-browser"], () => ng.forms);
//angular animation
define("@angular/animations", [], () => ng.animations);
define("@angular/animations/browser", ["@angular/animations"], () => ng.animations.browser);
define("@angular/platform-browser-animations", ["@angular/core", "@angular/platform-browser", "@angular/animations/browser"], () => ng.platformBrowser.animations);

/**
 * Main Entry
 */
define.amd = false;
requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error("Angular bootstrap failed:", err));
});