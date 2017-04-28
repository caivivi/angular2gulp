/// <reference path="../../node_modules/@types/requirejs/index.d.ts" />

const jsFolder = "scripts/", libFolder = `${jsFolder}lib/`;
requirejs.config({
    baseUrl: "/",
    waitSeconds: 2,
    paths: {
        
    }
});

requirejs(["@angular/platform-browser-dynamic", "modules/app/app.module"], ({ platformBrowserDynamic }, { AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(`Application bootstraping error:`, err));
});