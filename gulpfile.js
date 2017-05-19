"use strict";
const packageJson = require('./package.json');
const gulp = require("gulp");
const WebServer = require("gulp-webserver");
const gulpWatch = require("gulp-watch");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const HtmlMin = require("gulp-htmlmin");
const tsc = require("gulp-typescript");
const eleBuilder = require('electron-builder');
const del = require("del");
const path = require("path");
const colors = require("colors");

//folders
const srcFolder = "src/", srcScriptsFolder = `${srcFolder}scripts/`, appOutputFolder = "output/";
const destFolder = "dist/", destScriptsFolder = `${destFolder}scripts/`, licenseFile = "license.txt";
const nodeFolder = "node_modules/", angularFolder = `${nodeFolder}@angular/`, RxFolder = `${nodeFolder}rxjs/src/`, rxDestFolder = `${destScriptsFolder}rxjs/`;
let angularSrcFolder = `${srcScriptsFolder}@angular/`, angularDestFolder = `${destScriptsFolder}@angular/`;

const requirejs = `${nodeFolder}requirejs/require.js`, output = "bundle.js", maints = `${srcScriptsFolder}main.ts`, maintsOutput = `${destScriptsFolder}main.ts`;
const systemjs = `${nodeFolder}systemjs/dist/system.src.js`, systemjsConfig = `${srcScriptsFolder}systemjsConfig.ts`, systemjsConfigOutput = `${destScriptsFolder}systemjsConfig.js`, systemjsBundle = [systemjs, systemjsConfigOutput];
const corejs = `${nodeFolder}core-js/client/core.js`;

const allHTML = `${srcFolder}**/*.html`, allCSS = `${srcFolder}**/*.css`, allScript = [`${srcFolder}**/*.ts`, `!${srcScriptsFolder}dummyModules.ts`, `!${systemjsConfig}`];
const otherFiles = [`${srcFolder}**/*`, `!${allHTML}`, `!${allCSS}`, `!${srcFolder}**/*.ts`], appIcon = "dist/favicon.ico", appIconAbsolute = path.join(__dirname, appIcon);

// configurations
const appOptions = {
    angular: {
        mergeAngular: true,
        includeAnimation: false,
        includeExtraModules: true,
        useES5: false,
        useUMD: false
    },
    tsc: {
        get module() {
            let mod = "system";

            switch (appOptions.moduleLoader) {
                case systemjs: break;
                case requirejs: mod = "amd"; break;
                default: break;
            }

            return mod;
        }
    },
    get moduleLoader() {
        return systemjs;//systemjs, requirejs
    }
};
const cleanCSSOptions = {};
const delOptions = { force: true };
const serverOptions = {
    port: 3000,
    livereload: true,
    directoryListing: false,
    open: false
};
const htmlMinOptions = {
    collapseWhitespace: true,
    removeComments: true,
    caseSensitive: true
};
const builderOptions = {
    appMetadata: {
        name: packageJson.name,
        version: packageJson.version,
        homepage: packageJson.homepage,
        author: {
            name: packageJson.author.name,
            email: packageJson.author.email
        }
    },
    publish: null,
    targets: eleBuilder.Platform.current().createTarget(),
    config: {
        artifactName: "${productName} Setup ${version}.${ext}",
        compression: "maximum",
        files: [
            destFolder,
            "index.js",
            "package.json"
        ],
        directories: {
            output: appOutputFolder
        },
        linux: {
            target: ["deb", "zip"],
            icon: appIconAbsolute
        },
        win: {
            target: ["nsis", "zip"],
            icon: appIconAbsolute,
            publisherName: [packageJson.author.name]
        },
        mac: {
            category: "Utilities",
            target: ["dmg", "zip"],
            icon: appIconAbsolute
        },
        nsis: {
            oneClick: false,
            allowToChangeInstallationDirectory: true,
            runAfterFinish: false,
            installerIcon: appIconAbsolute,
            deleteAppDataOnUninstall: true,
            license: path.join(__dirname, licenseFile),
            multiLanguageInstaller: true,
            menuCategory: true,
            useZip: true
        },
        squirrelWindows: {
            iconUrl: appIconAbsolute,
            loadingGif: null
        }
    }
};

/* variables */
let tsForDummy = tsc.createProject({ target: "es5", lib: ["dom", "es2017"], module: appOptions.tsc.module });

//app tasks
gulp.task("clean", [], async () => {
    try {
        let deletionResult = await del([`${destFolder}**/*`, `${appOutputFolder}**/*`], delOptions);
        logMsg(deletionResult.length.toString().blue, `file${deletionResult.length <= 1 ? " has" : "s have"} been deleted.`);
    } catch (ex) {
        logErr(`An error occurred while cleanninng:`, ex);
    }
});

gulp.task("compile", ["clean"], async () => {
    try {
        /* Angular */
        const es5 = appOptions.angular.useES5 ? ".es5" : "";
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

        angularBundle = appOptions.angular.includeAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;
        angularBundle = appOptions.angular.includeExtraModules ? [...angularBundle, ...angularExtraBundle] : angularBundle;

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
            if (appOptions.angular.includeAnimation) {
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

        let rxPro = new Promise((resolve, reject) => {
            gulp.src([`${RxFolder}**/*`, `!${RxFolder}Rx.global.js`])
                .pipe(gulp.dest(rxDestFolder))
                .on("finish", () => {
                    logMsg("Rxjs source module files have been copied to dist folder.");
                    resolve(true);
                }).on("error", () => {
                    logErr("An error occurred while copying rxjs source module.");
                    reject(false);
                });
        });

        let systemPro = new Promise((resolve, reject) => {
            logMsg("Copying systemjs configuration...");
            let files = [systemjsConfig];
            appOptions.moduleLoader === systemjs && files.push(maints);

            gulp.src(files)
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Systemjs configuration copy complete.`);
                    resolve(true);
                })
                .on("error", () => {
                    logErr("Error occurred while copying systemjs configuration.");
                    reject(false);
                });
        });

        let pResult = await Promise.all([ngPro, ngAniPro, rxPro, systemPro]);

        if (pResult.every(r => r)) {
            logMsg("Compiling & merging angular bundle...");
            let tsProject = tsc.createProject("ng.tsconfig.json", { module: appOptions.tsc.module, out: output });

            await new Promise((resolve, reject) => {
                tsProject.src()//Must us ts stream instead of gulp.src here.
                    .pipe(tsProject())
                    .pipe(gulp.dest(destScriptsFolder))
                    .on("finish", () => {
                        logMsg("Angular bundle has been compiled.");
                        resolve(true);
                    })
                    .on("error", () => {
                        logErr("An error occurred while compiling angular bundle.");
                        reject(false);
                    });
            });

            logMsg("Deleting temporary folders...");
            let deletionResult = await del([`${destScriptsFolder}/@angular/**`, `${destScriptsFolder}/rxjs/**`, `${destScriptsFolder}systemjsConfig.ts`, maintsOutput], delOptions);

            logMsg("Compressing & merging dependencies...");
            await new Promise((resolve, reject) => {
                let files = [systemjs, zonejs, reflectMetadata, `${destScriptsFolder}${output}`];
                appOptions.moduleLoader === requirejs && files.splice(2, 0, requirejs);

                gulp.src(files)
                    .pipe(concat(output))
                    .pipe(uglify())
                    .pipe(gulp.dest(destScriptsFolder))
                    .on("finish", () => {
                        logMsg("Bundle compression complete.");
                        resolve(true);
                    })
                    .on("error", () => {
                        logErr("Error occurred while compressing bundle.");
                        reject(false);
                    });
            });
        }
    } catch (ex) {
        logErr("Error occurred while copying angular source module", ex);
    }
});

gulp.task("compileumd", ["clean"], async () => {
    try {
        //fake module
        const dummyModules = `${srcScriptsFolder}dummyModules.ts`, dummyOutput = `${destScriptsFolder}dummyModules.js`;

        await new Promise((resolve, reject) => {
            logMsg("Compiling dummy modules...");
            gulp.src([dummyModules, systemjsConfig])
                .pipe(tsForDummy())
                .pipe(concat('dummyModules.js'))
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
            logMsg("Merging dummy modules...");
            gulp.src([appOptions.moduleLoader, dummyOutput])
                .pipe(concat(output))
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Requirejs merging complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while merging dummy module.");
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
        let angularBundle = [zonejs, reflectMetadata, corejs, `${destScriptsFolder}${output}`, angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic, angularRouter];
        let angularExtraBundle = [angularHttp, angularForms];
        let angularAnimationBundle = [angularAnimation, angularAnimationBrowser, angularPlatformBrowserAnimation];

        angularBundle = appOptions.angular.includeAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;
        angularBundle = appOptions.angular.includeExtraModules ? [...angularBundle, ...angularExtraBundle] : angularBundle;
        angularBundle = appOptions.moduleLoader === requirejs ? [systemjs, ...angularBundle] : angularBundle;

        let angularStream = gulp.src(appOptions.angular.mergeAngular ? [rxjs, ...angularBundle] : angularBundle);

        if (appOptions.angular.mergeAngular) {
            angularDestFolder = destScriptsFolder;

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
                .pipe(uglify())
                .pipe(gulp.dest(angularDestFolder))
                .on("finish", () => {
                    logMsg(`Angular bundle compression complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while compressing angular bundle.");
                    reject();
                });
        });

        logMsg("Deleting temporary files...");
        await del([dummyOutput], delOptions);
    } catch (ex) {
        logErr("Error occurred while building angular bundle:", ex);
    }
});

gulp.task("build", [appOptions.angular.useUMD ? "compileumd" : "compile"], async () => {
    let tsProject = tsc.createProject("tsconfig.json", appOptions.tsc);

    //typescript
    let tsPro = new Promise((resolve, reject) => {
        gulp.src(allScript)
            .pipe(tsProject())
            .pipe(gulp.dest(destFolder))
            .on("finish", () => {
                logMsg("App typescript compilation complete.");
                resolve(true);
            })
            .on("error", () => {
                logErr("An error occurred while compiling app typescript.");
                reject(false);
            });
    });

    //css
    let cssPro = new Promise((resolve, reject) => {
        gulp.src(allCSS)
            .pipe(cleanCSS(cleanCSSOptions))
            .pipe(gulp.dest(destFolder))
            .on("finish", () => {
                logMsg("App css compilation complete.");
                resolve(true);
            })
            .on("error", () => {
                logErr("An error occurred while compiling app css.");
                reject(false);
            });
    });

    //html
    let htmlPro = new Promise((resolve, reject) => {
        gulp.src(allHTML)
            .pipe(HtmlMin(htmlMinOptions))
            .pipe(gulp.dest(destFolder))
            .on("finish", () => {
                logMsg("App html compilation complete.");
                resolve(true);
            })
            .on("error", () => {
                logErr("An error occurred while compiling app html.");
                reject(false);
            });
    });

    //other
    let otherPro = new Promise((resolve, reject) => {
        gulp.src(otherFiles)
            .pipe(gulp.dest(destFolder))
            .on("finish", () => {
                logMsg("App files transferring complete.");
                resolve(true);
            })
            .on("error", () => {
                logErr("An error occurred while transferring app files.");
                reject(false);
            });
    });

    await Promise.all([tsPro, cssPro, htmlPro, otherPro]);
});

gulp.task("watch", ["build"], async () => {
    appOptions.moduleLoader === systemjs && allScript.push(`!${maints}`);

    //typescript
    try {
        let tsProject = tsc.createProject("tsconfig.json", appOptions.tsc);
        let stream = watch();
        logMsg("Typescript files are being watched for compilation and compression...");

        gulpWatch("tsconfig.json", (e) => {
            tsProject = tsc.createProject("tsconfig.json", appOptions.tsc);
            stream.close();
            stream = watch();
            logMsg("Tsconfig change detected, corresponding scripts are being updated.");
        });

        function watch() {
            compile();
            return gulpWatch(allScript, (e) => {
                !!e.history.length && logMsg("Typescript file change detected:", e.history[0].gray);
                compile(e.history);
            });
        }

        function compile(files) {
            return gulp.src(!!files && !!files.length === 1 ? files : allScript).pipe(tsProject())
                .pipe(gulp.dest(destFolder));
        }

    } catch (ex) {
        logErr("Typescript compilation error:", ex);
    }

    //css
    try {
        compile();
        logMsg("Style files are being watched for compilation and compression...");

        gulpWatch(allCSS, (e) => {
            !!e.history.length && logMsg("Style file change detected:", e.history[0].gray);
            compile(e.history);
        });

        function compile(files) {
            gulp.src(!!files && files.length ? files: allCSS)
                .pipe(cleanCSS(cleanCSSOptions, (detail) => { }))
                .pipe(gulp.dest(!!files && files.length === 1 ? path.dirname(files[0].toDist()) : destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while compiling css:", ex);
    }

    //html
    try {
        compile();
        logMsg("HTML files are being watched for compilation and compression...");

        gulpWatch(allHTML, (e) => {
            !!e.history.length && logMsg("HTML file change detected:", e.history[0].gray);
            compile(e.history);
        });

        function compile(files) {
            gulp.src(!!files && files.length ? files : allHTML)
                .pipe(HtmlMin(htmlMinOptions))
                .pipe(gulp.dest(!!files && files.length === 1 ? path.dirname(files[0].toDist()) : destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while transferring html files:", ex);
    }

    //others
    try {
        transfer();

        gulpWatch(otherFiles, (e) => {
            !!e.history.length && logMsg(`File ${e.history[0].gray} has been copied to dist folder.`);
            transfer(e.history);
        });

        function transfer(files) {
            gulp.src(!!files && files.length ? files : otherFiles)
                .pipe(gulp.dest(!!files && files.length === 1 ? path.dirname(files[0].toDist()) : destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while copying files:", ex);
    }

    await new Promise(() => { });
});

gulp.task("startDevServer", [], async () => {
    gulp.src(destFolder).pipe(WebServer(serverOptions));
});

gulp.task("releaseApp", ["build"], async () => {
    try {
        let result = await eleBuilder.build(builderOptions);
        logMsg("Installer build complete: ", result[0]);
    } catch (err) {
        logErr("Error occurred while building installer:", err);
    }
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

String.prototype.toDist = function () {
    const srcPathIndex = this.indexOf(path.join(__dirname, srcFolder));
    if (srcPathIndex < 0) return this;

    let appPath = this.substring(0, srcPathIndex);
    return path.join(appPath, destFolder, this.substring(srcPathIndex + srcFolder.length));
}