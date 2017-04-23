const gulp = require("gulp");
const browserify = require("browserify");
const WebServer = require("gulp-webserver");
const gulpWatch = require("gulp-watch");
//const Debug = require("gulp-debug");
//const Uglify = require("gulp-uglify");
//const plumber = require("gulp-plumber");
const MinifyCSS = require("gulp-minify-css");
const HtmlMin = require("gulp-htmlmin");
const tsc = require("gulp-typescript");
const del = require("del");
const colors = require("colors");

//folders
const appFolder = "./app/", appScriptsFolder = `${appFolder}scripts/`, appStyleFolder = `${appFolder}styles/`;
const destFolder = "./dist/", destScriptsFolder = `${destFolder}scripts/`, destStyleFolder = `${destFolder}styles/`;

//tasks
gulp.task("clean", [], async () => {
    try {
        let deletionResult = await del(`${destFolder}**/*`);
        console.log(deletionResult.length.toString().blue ,`file${deletionResult.length <= 1 ? " has" : "s have"} been deleted.`.green);
    } catch (ex) {
        console.error(`An error occurred while executing task ${this.name}:`.red, ex.message);
    }
});

gulp.task("compile", ["clean"], async () => {
    //typescript
    try {
        let tsProject = tsc.createProject("tsconfig.json");
        let stream = watch();
        console.log("Typescript files are being watched for compilation and compression...".yellow);

        gulpWatch("tsconfig.json", (e) => {
            tsProject = tsc.createProject("tsconfig.json");
            stream.close();
            stream = watch();
            console.log("Tsconfig change detected, corresponding scripts are being updated.".yellow);
        });

        function watch() {
            compile();
            return gulpWatch(`${appFolder}**/*.ts`, (e) => {
                e.history.length && console.log("Typescript file change detected:".yellow, e.history[0].gray);
                compile();
            });
        }

        function compile() {
            tsProject.src()
                .pipe(tsProject())
                .pipe(gulp.dest(destFolder));
        }
        
    } catch (ex) {
        console.log("Typescript compilation error:".red, ex.message);
    }

    //css
    try {
        const allCSS = `${appStyleFolder}**/*.css`;

        console.log("Style files are being watched for compilation and compression...".yellow);
        compile();
        gulpWatch(allCSS, (e) => {
            !!e.history.length && console.log("Style file change detected:".yellow, e.history[0].gray);
            compile(e.history);
        });

        function compile(files) {
            gulp.src(!!files ? files : allCSS)
                .pipe(MinifyCSS())
                .pipe(gulp.dest(destStyleFolder));
        }
    } catch (ex) {
        console.error("Error occurred while compiling css".red, ex.message);
    }

    //html
    try {
        const allHTML = [`${appFolder}**/*.html`];
        console.log("HTML files are being watched for compilation and compression...".yellow);
        compile();

        gulpWatch(allHTML, (e) => {
            !!e.history.length && console.log("HTML file change detected:".yellow, e.history[0].gray);
            compile();
        });

        function compile(files) {
            gulp.src(!!files ? files : allHTML)
                .pipe(HtmlMin({collapseWhitespace: true}))
                .pipe(gulp.dest(destFolder));
        }
    } catch (ex) {
        console.error("Error occurred while transferring static files: ".red, ex.message.red);
    }
});

gulp.task("startDevServer", ["compile"], async () => {
    gulp.src(destFolder)
        .pipe(WebServer({
            port: 3000,
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task("default", ["startDevServer"]);