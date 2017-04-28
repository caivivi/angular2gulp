const gulp = require("gulp");
const WebServer = require("gulp-webserver");
const gulpWatch = require("gulp-watch");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
//const Debug = require("gulp-debug");
//const plumber = require("gulp-plumber");
const cleanCSS = require("gulp-clean-css");
const HtmlMin = require("gulp-htmlmin");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsc = require("gulp-typescript");
const del = require("del");
const colors = require("colors");

//folders
const appFolder = "./app/", appScriptsFolder = `${appFolder}scripts/`, appStyleFolder = `${appFolder}styles/`;
const appScriptLibFolder = `${appScriptsFolder}lib/`;
const destFolder = "./dist/", destScriptsFolder = `${destFolder}scripts/`, destStyleFolder = `${destFolder}styles/`;
const destScriptLibFolder = `${destScriptsFolder}lib/`;
const nodeFolder = "./node_modules/", angularFolder = `${nodeFolder}@angular/`, RxFolder = `${nodeFolder}rxjs/src/`, rxDestFolder = `${destScriptLibFolder}rxjs/`;
let angularAppFolder = `${appScriptLibFolder}@angular/`, angularDestFolder = `${destScriptLibFolder}@angular/`;
const requirejs = `${nodeFolder}requirejs/require.js`, output = "bundle.js";;

//configurations
const appConfig = {
    angular: {
        mergeAngular: true,
        includeAnimation: false,
        includeExtraModules: false,
        useES5: false,
        useUMD: true
    }
};
const cleanCSSConfig = {};

//tasks
gulp.task("clean", [], async () => {
    try {
        let deletionResult = await del([`${destFolder}**/*`, `${appScriptLibFolder}**/*`]);
        logMsg(deletionResult.length.toString().blue, `file${deletionResult.length <= 1 ? " has" : "s have"} been deleted.`);
    } catch (ex) {
        logErr(`An error occurred while executing task ${this.name}:`, ex);
    }
});

gulp.task("compile", ["clean"], async () => {
    try {
        /* Angular */
        const es5 = appConfig.angular.useES5 ? ".es5" : "";
        const reflectMetadata = `${nodeFolder}reflect-metadata/Reflect.js`, zonejs = `${nodeFolder}zone.js/dist/zone.js`;
        const angularCore = `${angularFolder}core/@angular/core${es5}.js`;
        const angularCommon = `${angularFolder}common/@angular/common${es5}.js`;
        const angularCompiler = `${angularFolder}compiler/@angular/compiler${es5}.js`;
        const angularPlatformBrowser = `${angularFolder}platform-browser/@angular/platform-browser${es5}.js`;
        const angularPlatformBrowserDynamic = `${angularFolder}platform-browser-dynamic/@angular/platform-browser-dynamic${es5}.js`;
        const angularRouter = `${angularFolder}router/@angular/router${es5}.js`;
        const angularHttp = `${angularFolder}http/@angular/http${es5}.js`;
        const angularForms = `${angularFolder}forms/@angular/forms${es5}.js`;
        //angular animation
        const angularAnimation = `${angularFolder}animations/@angular/animations${es5}.js`;
        const angularPlatformBrowserAnimation = `${angularFolder}platform-browser/@angular/platform-browser/animations${es5}.js`;
        const angularAnimationBrowser = `${angularFolder}animations/@angular/animations/browser${es5}.js`;
        //bundle
        let angularBundle = [angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic, angularRouter];
        let angularExtraBundle = [angularHttp, angularForms];
        let angularAnimationBundle = [angularAnimation];

        angularBundle = appConfig.angular.includeAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;
        angularBundle = appConfig.angular.includeExtraModules ? [...angularBundle, ...angularExtraBundle] : angularBundle;

        let ngPro = new Promise((resolve, reject) => {
            gulp.src(angularBundle)
                .pipe(rename((path) => path.basename = path.basename.replace(/\.es5/ig, "")))
                .pipe(gulp.dest(angularDestFolder))
                .on("finish", () => {
                    logMsg("Angular source module files have been copied to dist folder.");
                    resolve(true);
                }).on("error", () => {
                    logErr("An error occurred while copying angular source module.");
                    reject(false);
                });
        });

        let ngAniPro = new Promise((resolve, reject) => {
            if (appConfig.angular.includeAnimation) {
                gulp.src(angularAnimationBrowser)//animation/browser
                    .pipe(rename("animations/browser.js"))
                    .pipe(gulp.dest(angularDestFolder));

                gulp.src([angularPlatformBrowserAnimation])//platform-browser-animations
                    .pipe(rename("platform-browser-animations.js"))
                    .pipe(gulp.dest(angularDestFolder))
                    .on("finish", () => {
                        logMsg("Angular browser animation modules have been copied to dist folder.");
                        resolve(true);
                    }).on("error", () => {
                        logErr("An error occurred while copying angular animation modules.");
                        reject(false);
                    });
            } else {
                resolve(true);
            }
        });

        /* Rxjs */
        let rxPro = new Promise((resolve, reject) => {
            gulp.src(`${RxFolder}**/*`)
                .pipe(gulp.dest(rxDestFolder))
                .on("finish", () => {
                    logMsg("Rxjs source module files have been copied to dist folder.");
                    resolve(true);
                }).on("error", () => {
                    logErr("An error occurred while copying rxjs source module.");
                    reject(false);
                });
        });

        let pResult = await Promise.all([ngPro, ngAniPro, rxPro]);

        if (pResult.every(r => r)) {//when both angular and rxjs source module copied successfully.
            logMsg("Compiling & merging angular bundle...");
            tsProject = tsc.createProject("ng.tsconfig.json", { out: output });

            await new Promise((resolve, reject) => {
                tsProject
                    .src()
                    .pipe(tsProject())
                    .pipe(gulp.dest(destScriptLibFolder))
                    .on("finish", () => {
                        logMsg("Angular bundle has been compiled.");
                        resolve(true);
                    })
                    .on("error", () => {
                        logErr("An error occurred while compiling angular bundle.");
                        reject(false);
                    });
            });

            logMsg("Merging & compressing zone, reflect-metadata and requirejs...");
            await new Promise((resolve, reject) => {
                gulp.src([zonejs, reflectMetadata, requirejs, `${destScriptLibFolder}${output}`])
                    .pipe(concat(output))
                    .pipe(uglify())
                    .pipe(gulp.dest(destScriptLibFolder))
                    .on("finish", () => {
                        logMsg("Bundle compression complete.");
                        resolve(true);
                    })
                    .on("error", () => {
                        logErr("Error occurred while compressing bundle.");
                        reject(false);
                    });
            });

            logMsg("Deleting temporary folders...");
            let deletionResult = await del([`${destScriptLibFolder}/@angular/**`, `${destScriptLibFolder}/rxjs/**`], { force: true });
        }
    } catch (ex) {
        logErr("Error occurred while copying angular source module", ex);
    }
});

gulp.task("compileumd", ["clean"], async () => {
    try {
        //requirejs & fake module
        let tsForDummy = tsc.createProject({ target: "es5", lib: ["dom", "es2017"] });
        const dummyModules = `${appScriptsFolder}dummyModules.ts`, dummyOutput = `${destScriptsFolder}dummyModules.js`;

        await new Promise((resolve, reject) => {
            logMsg("Compiling dummy modules...");
            gulp.src([dummyModules])
                .pipe(tsForDummy())
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Dummy module compilition complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while compiling dummy module.");
                    reject();
                });
        });

        await new Promise((resolve, reject) => {
            logMsg("Merging dummy modules to requirejs...");
            gulp.src([requirejs, dummyOutput])
                .pipe(concat(output))
                .pipe(gulp.dest(destScriptLibFolder))
                .on("finish", () => {
                    logMsg(`Requirejs merging complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while merging requirejs.");
                    reject();
                });
        });

        //angular
        const rxjs = `${nodeFolder}rxjs/bundles/Rx.js`, zonejs = `${nodeFolder}zone.js/dist/zone.js`;
        const reflectMetadata = `${nodeFolder}reflect-metadata/Reflect.js`;
        const angularCore = `${angularFolder}core/bundles/core.umd.js`;
        const angularCommon = `${angularFolder}common/bundles/common.umd.js`;
        const angularCompiler = `${angularFolder}compiler/bundles/compiler.umd.js`;
        const angularPlatformBrowser = `${angularFolder}platform-browser/bundles/platform-browser.umd.js`;
        const angularPlatformBrowserDynamic = `${angularFolder}platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js`;
        const angularRouter = `${angularFolder}router/bundles/router.umd.js`;
        const angularHttp = `${angularFolder}http/bundles/http.umd.js`;
        const angularForms = `${angularFolder}forms/bundles/forms.umd.js`;
        //angularanimation
        const angularAnimation = `${angularFolder}animations/bundles/animations.umd.js`;
        const angularAnimationBrowser = `${angularFolder}animations/bundles/animations-browser.umd.js`;
        const angularPlatformBrowserAnimation = `${angularFolder}platform-browser/bundles/platform-browser-animations.umd.js`;
        //bundle
        let angularBundle = [`${destScriptLibFolder}${output}`, zonejs, reflectMetadata, angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic, angularRouter];
        let angularExtraBundle = [angularHttp, angularForms];
        let angularAnimationBundle = [angularAnimation, angularAnimationBrowser, angularPlatformBrowserAnimation];

        angularBundle = appConfig.angular.includeAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;
        angularBundle = appConfig.angular.includeExtraModules ? [...angularBundle, ...angularExtraBundle] : angularBundle;

        let angularStream = gulp.src(appConfig.angular.mergeAngular ? [rxjs, ...angularBundle] : angularBundle);

        if (appConfig.angular.mergeAngular) {
            angularDestFolder = `${destScriptLibFolder}`;

            await new Promise((resolve, reject) => {
                logMsg("Merging angular bundle...");

                angularStream = angularStream.pipe(concat(output));
                angularStream
                    .on("finish", () => {
                        logMsg(`Angular bundle merging complete.`);
                        resolve();
                    })
                    .on("error", () => {
                        logErr("Error occurred while merging angular bundle.");
                        reject();
                    });
            });
        }

        await new Promise((resolve, reject) => {
            logMsg("Compressing angular bundle...");

            angularStream
                //.pipe(uglify())
                .pipe(gulp.dest(angularDestFolder))
                .on("finish", () => {
                    logMsg(`Angular compression complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while compressing angular.");
                    reject();
                });
        });

        logMsg("Deleting temporary files...");
        await del([dummyOutput]);
        console.log("hahaha");
    } catch (ex) {
        logErr("Error occurred while building angular bundle:", ex);
    }
});

gulp.task("build", [appConfig.angular.useUMD ? "compileumd" : "compile"]);

gulp.task("watch", ["build"], async () => {
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
                    logMsg(`Style file [${detail.name}] has been compressed from ${detail.stats.originalSize.toString().gray} to ${detail.stats.minifiedSize.toString().gray}.`);
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
                .pipe(HtmlMin({ collapseWhitespace: true }))
                .pipe(gulp.dest(destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while transferring static files:", ex);
    }

    await new Promise(() => { });
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

gulp.task("default", ["watch", "startDevServer"]);

function padZero(val) {
    return val < 10 ? "0" + val : val;
}

function outputDate() {
    let date = new Date();
    date = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

    return `[${date.gray}]`.white + "[App]".green;
}

function logMsg(...msg) {
    !!msg && console.log(outputDate(), ...msg);
}

function logErr(msg, ex) {
    !!msg && console.log(outputDate(), msg.red, !!ex && `${ex.stack}`);
}