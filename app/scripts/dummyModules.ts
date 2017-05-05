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
 * Dummy Modules
 */
//rxjs
define("rxjs/Observable", [], () => Rx);
define("rxjs/observable/merge", [], () => Rx.Observable);
define("rxjs/operator/share", [], () => Rx.Observable.prototype);
define("rxjs/Subject", [], () => Rx);
define("rxjs/BehaviorSubject", [], () => Rx);
define("rxjs/observable/from", [], () => Rx.Observable);
define("rxjs/observable/of", [], () => Rx.Observable);
define("rxjs/observable/fromPromise", [], () => Rx.Observable);
define("rxjs/operator/concatMap", [], () => Rx.Observable.prototype);
define("rxjs/operator/every", [], () => Rx.Observable.prototype);
define("rxjs/operator/first", [], () => Rx.Observable.prototype);
define("rxjs/operator/map", [], () => Rx.Observable.prototype);
define("rxjs/operator/mergeMap", [], () => Rx.Observable.prototype);
define("rxjs/operator/reduce", [], () => Rx.Observable.prototype);
define("rxjs/operator/catch", [], () => Rx.Observable.prototype);
define("rxjs/operator/concatAll", [], () => Rx.Observable.prototype);
define("rxjs/operator/last", [], () => Rx.Observable.prototype);
define("rxjs/operator/mergeAll", [], () => Rx.Observable.prototype);
define("rxjs/observable/forkJoin", [], () => Rx.Observable);
define("rxjs/operator/filter", [], () => Rx.Observable.prototype);
define("rxjs/add/operator/map", [], () => Rx.Observable.prototype);
define("rxjs/add/operator/toPromise", [], () => Rx.Observable.prototype);
define("rxjs/util/EmptyError", [], () => Rx);
//angular
define("@angular/core", [], () => ng.core);
define("@angular/common", ["@angular/core"], () => ng.common);
define("@angular/compiler", ["@angular/core"], () => ng.compiler);
define("@angular/platform-browser", ["@angular/common", "@angular/core"], () => ng.platformBrowser);
define("@angular/platform-browser-dynamic", ["@angular/compiler", "@angular/core", "@angular/common", "@angular/platform-browser"], () => ng.platformBrowserDynamic);
define("@angular/router", ["@angular/common", "@angular/core", "rxjs/BehaviorSubject", "rxjs/Subject", "rxjs/observable/from", "rxjs/observable/of", "rxjs/operator/concatMap",
    "rxjs/operator/every", "rxjs/operator/first", "rxjs/operator/map", "rxjs/operator/mergeMap", "rxjs/operator/reduce", "rxjs/Observable", "rxjs/operator/catch", "rxjs/operator/concatAll",
    "rxjs/util/EmptyError", "rxjs/observable/fromPromise", "rxjs/operator/last", "rxjs/operator/mergeAll", "@angular/platform-browser", "rxjs/operator/filter"], () => ng.router);
//angular extra
define("@angular/http", ["@angular/core", "rxjs/Observable", "@angular/platform-browser"], () => ng.http);
define("@angular/forms", ["@angular/core", "rxjs/observable/forkJoin", "rxjs/observable/fromPromise", "rxjs/operator/map", "@angular/platform-browser"], () => ng.forms);
// //angular animation
// define("@angular/animations", [], () => ng.animations);
// define("@angular/animations/browser", ["@angular/animations"], () => ng.animations.browser);
// define("@angular/platform-browser-animations", ["@angular/core", "@angular/platform-browser", "@angular/animations/browser"], () => ng.platformBrowser.animations);

define.amd = false;