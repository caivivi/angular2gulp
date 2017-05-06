// /// <reference path="../../node_modules/@types/requirejs/index.d.ts" />

// requirejs.config({
//     baseUrl: "/",
//     waitSeconds: 2,
//     paths: { }
// });

// requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
//     platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
// });

Promise.all([System.import("@angular/platform-browser-dynamic"), System.import("modules/app/app.module")])
.then(([{ platformBrowserDynamic }, { AppModule }]) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
});