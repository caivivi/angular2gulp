"use strict";
const packageJson = require('./package.json');
const gulp = require("gulp");
const webServer = require("gulp-webserver");
const gulpWatch = require("gulp-watch");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const htmlMin = require("gulp-htmlmin");
const tsc = require("gulp-typescript");
const eleBuilder = require('electron-builder');
const del = require("del");
const path = require("path");
const colors = require("colors");

//folders
const srcFolder = "src/", srcScriptsFolder = `${srcFolder}scripts/`, appOutputFolder = "output/";
const destFolder = "dist/", destScriptsFolder = `${destFolder}scripts/`, destStyleFolder = `${destFolder}styles/`, licenseFile = "license.txt";
const srcResourceFolder = `${srcFolder}resources/`, destResourceFolder = `${destFolder}resources/`;
const srcImageFolder = `${srcResourceFolder}images/`, destImageFolder = `${destResourceFolder}images/`;
const nodeFolder = "node_modules/", angularFolder = `${nodeFolder}@angular/`, RxFolder = `${nodeFolder}rxjs/src/`, rxDestFolder = `${destScriptsFolder}rxjs/`;
const angularDestFolder = `${destScriptsFolder}@angular/`;

const output = "bundle.js", maints = `${srcFolder}main.ts`, maintsOutput = `${destScriptsFolder}main.ts`, mainJs = `${destScriptsFolder}main.js`, serviceWorkerTS = `${srcFolder}serviceWorker.ts`;
const reflectMetadata = `${nodeFolder}reflect-metadata/Reflect.js`, zonejs = `${nodeFolder}zone.js/dist/zone.js`, corejs = `${nodeFolder}core-js/client/core.js`;
const systemjs = `${nodeFolder}systemjs/dist/system.src.js`, dummyModule = `${srcScriptsFolder}dummyModules.ts`, angularPolyfill = [zonejs, reflectMetadata, systemjs];
const openseadragonFolder = `${nodeFolder}openseadragon/build/openseadragon/`, openseadragonImageFolder = `${openseadragonFolder}images/`;
const openseadragonjs = `${openseadragonFolder}openseadragon.js`, openseadragonFiltering = `${nodeFolder}openseadragon-filtering/openseadragon-filtering.js`;
const openseadragonAnnotations = `${nodeFolder}openseadragon-annotations/dist/openseadragon-annotations.js`;
const leafletFolder = `${nodeFolder}leaflet/dist/`, leafletjs = `${leafletFolder}leaflet-src.js`, leafletcss = `${leafletFolder}leaflet.css`, leafletDeepZoom = `${srcScriptsFolder}leaflet-deepzoom.js`;

const allHTML = `${srcFolder}**/*.html`, allCSS = `${srcFolder}**/*.css`, allScript = [`${srcFolder}**/*.ts`, `!${maints}`, `!${dummyModule}`, `!${serviceWorkerTS}`, `!${leafletDeepZoom}`];
const otherFiles = [`${srcFolder}**/*`, `!${allHTML}`, `!${allCSS}`, `!${srcFolder}**/*.ts`], appIcon = "dist/favicon.ico", appIconAbsolute = path.join(__dirname, appIcon);

// configurations
const buildOptions = {
    angular: {
        includeAnimation: false,
        useES5: false,
        useUMD: false
    },
    tsc: {
        get module() {
            let mod = "system";

            switch (buildOptions.moduleLoader) {
                case systemjs: break;
                default: break;
            }

            return mod;
        }
    },
    get moduleLoader() {
        return systemjs;
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
    publish: [
        {
            provider: "generic",
            owner: packageJson.author.name,
            url: "http://zc01n02074:81/"
        }
    ],
    targets: eleBuilder.Platform.current().createTarget(),
    config: {
        artifactName: "${productName} Setup ${version}.${ext}",
        compression: "maximum",
        files: [
            destFolder,
            "index.js",
            "package.json",
            "license.txt"
        ],
        directories: {
            output: appOutputFolder
        },
        linux: {
            target: ["deb", "zip"],
            // icon: appIconAbsolute
        },
        win: {
            target: ["nsis"],
            icon: appIconAbsolute,
            publisherName: [packageJson.author.name]
        },
        mac: {
            category: "Utilities",
            target: ["dmg", "zip"],
            // icon: appIconAbsolute
        },
        nsis: {
            oneClick: false,
            allowToChangeInstallationDirectory: true,
            runAfterFinish: false,
            installerIcon: appIconAbsolute,
            deleteAppDataOnUninstall: true,
            license: path.join(__dirname, licenseFile),
            multiLanguageInstaller: true,
            menuCategory: true
        },
        squirrelWindows: {
            iconUrl: appIconAbsolute,
            loadingGif: null
        }
    }
};

/* variables */
let tsForDummy = tsc.createProject({ target: "es5", lib: ["dom", "es2017"], module: buildOptions.tsc.module });

//app tasks
gulp.task("clean", [], async () => {
    try {
        let deletionResult = await del([`${destFolder}**/*`, `${appOutputFolder}**/*`], delOptions);
        logMsg(deletionResult.length.toString().blue, `file${deletionResult.length <= 1 ? " has" : "s have"} been deleted.`);
    } catch (ex) {
        logErr(`An error occurred while cleanninng:`, ex);
    }
});

gulp.task("compileAngular", ["clean"], async () => {
    try {
        const es5 = buildOptions.angular.useES5 ? ".es5" : "";
        /* angular */
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
        let angularBundle = [angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic, angularRouter, angularHttp, angularForms];
        let angularAnimationBundle = [angularAnimation];

        angularBundle = buildOptions.angular.includeAnimation ? [...angularBundle, ...angularAnimationBundle] : angularBundle;

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
            if (buildOptions.angular.includeAnimation) {
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

        let appPro = new Promise((resolve, reject) => {
            logMsg("Copying application scripts...");
            
            gulp.src([maints])
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Application scripts copy complete.`);
                    resolve(true);
                })
                .on("error", () => {
                    logErr("Error occurred while copying application scripts.");
                    reject(false);
                });
        });

        let pResult = await Promise.all([ngPro, ngAniPro, rxPro, appPro]);

        if (pResult.every(r => r)) {
            let tsProject = tsc.createProject("ng.tsconfig.json", { module: buildOptions.tsc.module, out: output });

            await new Promise((resolve, reject) => {
                logMsg("Compiling & merging angular bundle...");
                tsProject.src()//Must use ts stream instead of gulp.src here.
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
            let deletionResult = await del([`${destScriptsFolder}/@angular/**`, `${destScriptsFolder}/rxjs/**`, maintsOutput], delOptions);

            await new Promise((resolve, reject) => {
                logMsg("Compressing & merging dependencies...");
                let files = [...angularPolyfill, `${destScriptsFolder}${output}`];

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

gulp.task("compileAngularUMD", ["clean"], async () => {
    try {
        //angular
        const rxjs = `${nodeFolder}rxjs/bundles/Rx.js`;
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
        const angularBundle = [...angularPolyfill, rxjs, `${destScriptsFolder}${output}`, angularCore, angularCommon, angularCompiler, angularPlatformBrowser, angularPlatformBrowserDynamic, angularRouter, angularHttp, angularForms];
        const angularAnimationBundle = [angularAnimation, angularAnimationBrowser, angularPlatformBrowserAnimation];
        let tsProject = tsc.createProject("ng.tsconfig.json", { module: buildOptions.tsc.module }), angularStream;

        buildOptions.angular.includeAnimation && angularBundle.unshift(angularAnimationBundle);

        await new Promise((resolve, reject) => {
            logMsg("Copying application scripts...");
            
            gulp.src([maints])
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Application scripts copy complete.`);
                    resolve(true);
                })
                .on("error", () => {
                    logErr("Error occurred while copying application scripts.");
                    reject(false);
                });
        });

        await new Promise((resolve, reject) => {
            logMsg("Compiling application scripts...");
            
            tsProject.src()//Must use ts stream instead of gulp.src here.
                .pipe(tsProject())
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Application scripts compilation complete.`);
                    resolve(true);
                })
                .on("error", () => {
                    logErr("Error occurred while compiling application scripta.");
                    reject(false);
                });
        });

        logMsg("Deleting temporary files...");
        await del([maintsOutput, mainJs], delOptions);
        
        await new Promise((resolve, reject) => {
            logMsg("Merging & compressing angular bundle...");

            angularStream = gulp.src([...angularBundle, mainJs])
                .pipe(concat(output))
                .pipe(uglify())
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`Angular bundle compression complete.`);
                    resolve();
                })
                .on("error", () => {
                    logErr("Error occurred while compressing bundle.");
                    reject();
                });
        });
    } catch (ex) {
        logErr("Error occurred while building angular bundle:", ex);
    }
});

gulp.task("build", [buildOptions.angular.useUMD ? "compileAngularUMD" : "compileAngular"], async () => {
    let tsProject = tsc.createProject("tsconfig.json", buildOptions.tsc);

    //js third party libraries
    const bundles = {
        OpenSeadragon: [openseadragonjs, openseadragonAnnotations, openseadragonFiltering],//
        Leaflet: [leafletjs, leafletDeepZoom]
    }, bundleTasks = [];

    for (let bundle in bundles) {
        bundleTasks.push(new Promise((resolve, reject) => {
            logMsg(`Compressing ${bundle}...`);

            gulp.src(bundles[bundle])
                .pipe(concat(`${bundle.toLocaleLowerCase()}.js`))
                .pipe(uglify())
                .pipe(gulp.dest(destScriptsFolder))
                .on("finish", () => {
                    logMsg(`${bundle} compression complete.`);
                    resolve(true);
                })
                .on("error", () => {
                    logErr(`Error occurred while compressing ${bundle.capitalize()}.`);
                    reject(false);
                });
        }));
    }

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

    //app css
    let appCssPro = new Promise((resolve, reject) => {
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
            .pipe(htmlMin(htmlMinOptions))
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

    //third party css
    let cssPro = new Promise((resolve, reject) => {
        gulp.src([leafletcss])
            .pipe(cleanCSS(cleanCSSOptions))
            .pipe(gulp.dest(destStyleFolder))
            .on("finish", () => {
                logMsg("Third party css compilation complete.");
                resolve(true);
            })
            .on("error", () => {
                logErr("An error occurred while compiling third party css.");
                reject(false);
            });
    });

    //images
    let imgPro = new Promise((resolve, reject) => {
        logMsg("Copying third party library images...");
        
        let openseadragonFlag = false;
        let openseadragonStream = gulp.src([`${openseadragonImageFolder}*`])
            .pipe(gulp.dest(`${destImageFolder}openseadragon/`));

        indicateImageProEnd(openseadragonStream, () => openseadragonFlag = true);
            
        function indicateImageProEnd(stream, flagCallback) {
            flagCallback();
            stream.on("finish", () => {
                if (openseadragonFlag) {
                    logMsg("Third party library images copy complete.");
                    resolve(true);
                }
            })
            .on("error", () => {
                logErr("An error occurred while copying third party library images:");
                reject(false);
            });
        }
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

    await Promise.all([tsPro, appCssPro, cssPro, htmlPro, otherPro, imgPro, ...bundleTasks]);
});

gulp.task("watch", ["build"], async () => {
    //typescript
    try {
        let tsProject = tsc.createProject("tsconfig.json", buildOptions.tsc);
        let stream = watch();
        logMsg("Typescript files are being watched for compilation and compression...");

        gulpWatch("tsconfig.json", (e) => {
            tsProject = tsc.createProject("tsconfig.json", buildOptions.tsc);
            stream.close();
            stream = watch();
            logMsg("Tsconfig change detected, corresponding scripts are being updated.");
        });

        function watch() {
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
        logMsg("HTML files are being watched for compilation and compression...");
        gulpWatch(allHTML, (e) => {
            !!e.history.length && logMsg("HTML file change detected:", e.history[0].gray);
            compile(e.history);
        });

        function compile(files) {
            gulp.src(!!files && files.length ? files : allHTML)
                .pipe(htmlMin(htmlMinOptions))
                .pipe(gulp.dest(!!files && files.length === 1 ? path.dirname(files[0].toDist()) : destFolder));
        }
    } catch (ex) {
        logErr("Error occurred while transferring html files:", ex);
    }

    //others
    try {
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
    gulp.src(path.join(__dirname, destFolder)).pipe(webServer(serverOptions));
});

gulp.task("releaseApp", ["build"], async () => {
    try {
        let result = await eleBuilder.build(builderOptions);
        logMsg("Installer build complete: ", result[0]);
    } catch (err) {
        !!err && logErr("Error occurred while building installer:", err);
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
    let src = path.join(__dirname, srcFolder);
    let srcPathIndex = this.indexOf(src);
    if (srcPathIndex < 0) return this;

    let dist = path.join(__dirname, destFolder);
    return this.replace(src, dist);
}