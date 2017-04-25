const gulp = require("gulp");
const browserify = require("browserify");
const WebServer = require("gulp-webserver");
const gulpWatch = require("gulp-watch");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
//const Debug = require("gulp-debug");
//const plumber = require("gulp-plumber");
const cleanCSS = require("gulp-clean-css");
const HtmlMin = require("gulp-htmlmin");
const tsc = require("gulp-typescript");
const del = require("del");
const colors = require("colors");

//folders
const appFolder = "./app/", appScriptsFolder = `${appFolder}scripts/`, appStyleFolder = `${appFolder}styles/`;
const appScriptLibFolder = `${appScriptsFolder}lib/`;
const destFolder = "./dist/", destScriptsFolder = `${destFolder}scripts/`, destStyleFolder = `${destFolder}styles/`;
const destScriptLibFolder = `${destScriptsFolder}lib/`;
const nodeFolder = "./node_modules/", angularFolder = `${nodeFolder}@angular/`;

//configurations
const appConfig = {
    mergeAngular: true,
    angularAnimation: true
};
const cleanCSSConfig = {};

//tasks
gulp.task("clean", [], async () => {
    try {
        let deletionResult = await del([`${destFolder}**/*`, `${appScriptLibFolder}**/*`]);
        logMsg(deletionResult.length.toString().blue ,`file${deletionResult.length <= 1 ? " has" : "s have"} been deleted.`);
    } catch (ex) {
        logErr(`An error occurred while executing task ${this.name}:`, ex);
    }
});

gulp.task("lib", ["clean"], async () => {
    //lib
    const requirejs = `${nodeFolder}requirejs/require.js`, rxjs = `${nodeFolder}rxjs/bundles/Rx.js`, zonejs = `${nodeFolder}zone.js/dist/zone.js`;
    const reflectMetadata = `${nodeFolder}reflect-metadata/Reflect.js`;
    gulp.src([requirejs])
        .pipe(uglify())
        .pipe(gulp.dest(destScriptLibFolder));

    //angular
    const angularCore = `${angularFolder}/core/bundles/core.umd.js`;
    const angularCommon = `${angularFolder}/common/bundles/common.umd.js`;
    const angularCompiler = `${angularFolder}/compiler/bundles/compiler.umd.js`;
    const angularPlatformBrowser = `${angularFolder}/platform-browser/bundles/platform-browser.umd.js`;
    const angularPlatformBrowserDynamic = `${angularFolder}/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js`;
    //angularanimation
    const angularAnimation = `${angularFolder}/animations/bundles/animations.umd.js`;
    const angularAnimationBrowser = `${angularFolder}/animations/bundles/animations-browser.umd.js`;
    const angularPlatformBrowserAnimation = `${angularFolder}/platform-browser/bundles/platform-browser-animations.umd.js`;
    //bundle
    let angularBundle = [reflectMetadata, angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic];
    let angularAnimationBundle = [angularAnimation, angularAnimationBrowser, angularPlatformBrowserAnimation];

    angularBundle = appConfig.angularAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;

    let angularStream = gulp.src(appConfig.mergeAngular ? [rxjs, zonejs, ...angularBundle] : angularBundle);
    let angularAppFolder = `${appScriptLibFolder}@angular/`, angularDestFolder = `${destScriptLibFolder}@angular/`;

    if (appConfig.mergeAngular) {
        angularAppFolder = `${appScriptLibFolder}`;
        angularDestFolder = `${destScriptLibFolder}`;
        angularStream = angularStream.pipe(concat("angular.js"));
    }

    angularStream
        .pipe(uglify())
        .pipe(gulp.dest(angularAppFolder))
        .pipe(gulp.dest(angularDestFolder));

    logMsg(`Angular module compression complete with merging configured to ${appConfig.mergeAngular.toString().gray}.`);
});

gulp.task("compile", ["lib"], async () => {
    //typescript
    try {
        let tsProject = tsc.createProject("tsconfig.json");
        let stream = watch();
        logMsg("Typescript files are being watched for compilation and compression...");

        gulpWatch("tsconfig.json", (e) => {
            tsProject = tsc.createProject("tsconfig.json");
            stream.close();
            stream = watch();
            logMsg("Tsconfig change detected, corresponding scripts are being updated.");
        });

        function watch() {
            compile();
            return gulpWatch(`${appFolder}**/*.ts`, (e) => {
                e.history.length && logMsg("Typescript file change detected:", e.history[0].gray);
                compile();
            });
        }

        function compile() {
            tsProject.src()
                .pipe(tsProject())
                .pipe(gulp.dest(destFolder));
        }
        
    } catch (ex) {
        logErr("Typescript compilation error:", ex);
    }

    //css
    try {
        const allCSS = `${appStyleFolder}**/*.css`;

        logMsg("Style files are being watched for compilation and compression...");
        compile();
        gulpWatch(allCSS, (e) => {
            !!e.history.length && logMsg("Style file change detected:", e.history[0].gray);
            compile(e.history);
        });

        function compile(files) {
            gulp.src(!!files ? files : allCSS)
                .pipe(cleanCSS(cleanCSSConfig, (detail) => {
                    logMsg(`Style file [${detail.name}] has been compressed from ${detail.stats.originalSize} to ${detail.stats.minifiedSize}.`);
                }))
                .pipe(gulp.dest(destStyleFolder));
        }
    } catch (ex) {
        logErr("Error occurred while compiling css:", ex);
    }

    //html
    try {
        const allHTML = [`${appFolder}**/*.html`];
        logMsg("HTML files are being watched for compilation and compression...");
        compile();

        gulpWatch(allHTML, (e) => {
            !!e.history.length && logMsg("HTML file change detected:", e.history[0].gray);
            compile();
        });

        function compile(files) {
            gulp.src(!!files ? files : allHTML)
                .pipe(HtmlMin({collapseWhitespace: true}))
                .pipe(gulp.dest(destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while transferring static files:", ex);
    }
});

gulp.task("startDevServer", [], async () => {
    gulp.src(destFolder)
        .pipe(WebServer({
            port: 3000,
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task("default", ["compile", "startDevServer"]);

function logMsg(...msg) {
    let date = new Date();
    date = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    console.log(`[${date.gray}]`.white + "[App]".green, ...msg);
}

function padZero(val) {
    return val < 10 ? "0" + val : val;
}

function logErr(msg, ex) {
    console.log(msg.red, ex.message);
}