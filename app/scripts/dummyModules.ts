/// <reference path="../../node_modules/@types/requirejs/index.d.ts" />
/// <reference path="../../node_modules/@types/rx/index.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../node_modules/zone.js/dist/zone.js.d.ts" />

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
 * Dummy Modules
 */
//rxjs
define("rxjs/Observable", ["bundle"], () => Rx);
define("rxjs/observable/merge", ["bundle"], () => Rx.Observable);
define("rxjs/operator/share", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/Subject", ["bundle"], () => Rx);
define("rxjs/BehaviorSubject", ["bundle"], () => Rx);
define("rxjs/observable/from", ["bundle"], () => Rx.Observable);
define("rxjs/observable/of", ["bundle"], () => Rx.Observable);
define("rxjs/operator/concatMap", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/every", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/first", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/map", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeMap", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/reduce", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/catch", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/concatAll", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/util/EmptyError", ["bundle"], () => Rx);
define("rxjs/observable/fromPromise", ["bundle"], () => Rx.Observable);
define("rxjs/operator/last", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/operator/mergeAll", ["bundle"], () => Rx.Observable.prototype);
define("rxjs/observable/forkJoin", ["bundle"], () => Rx.Observable);
define("rxjs/operator/filter", ["bundle"], () => Rx.Observable.prototype);
//angular
define("@angular/core", ["bundle"], () => ng.core);
define("@angular/common", ["@angular/core"], () => ng.common);
define("@angular/compiler", ["@angular/core"], () => ng.compiler);
define("@angular/platform-browser", ["@angular/common", "@angular/core"], () => ng.platformBrowser);
define("@angular/platform-browser-dynamic", ["@angular/compiler", "@angular/core", "@angular/common", "@angular/platform-browser"], () => ng.platformBrowserDynamic);
define("@angular/router", ["@angular/common", "@angular/core", "rxjs/BehaviorSubject", "rxjs/Subject", "rxjs/observable/from", "rxjs/observable/of", "rxjs/operator/concatMap",
    "rxjs/operator/every", "rxjs/operator/first", "rxjs/operator/map", "rxjs/operator/mergeMap", "rxjs/operator/reduce", "rxjs/Observable", "rxjs/operator/catch", "rxjs/operator/concatAll",
    "rxjs/util/EmptyError", "rxjs/observable/fromPromise", "rxjs/operator/last", "rxjs/operator/mergeAll", "@angular/platform-browser", "rxjs/operator/filter"], () => ng.router);
//angular extra
// define("@angular/http", ["@angular/core", "rxjs/Observable", "@angular/platform-browser"], () => ng.http);
// define("@angular/forms", ["@angular/core", "rxjs/observable/forkJoin", "rxjs/observable/fromPromise", "rxjs/operator/map", "@angular/platform-browser"], () => ng.forms);
// //angular animation
// define("@angular/animations", [], () => ng.animations);
// define("@angular/animations/browser", ["@angular/animations"], () => ng.animations.browser);
// define("@angular/platform-browser-animations", ["@angular/core", "@angular/platform-browser", "@angular/animations/browser"], () => ng.platformBrowser.animations);

define.amd = false;