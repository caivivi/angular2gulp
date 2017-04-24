requirejs.config({
    baseUrl: "scripts",
    waitSeconds: 1,
    paths: {
        "lodash": "lib/lodash",
        "zone": "lib/zone",
        "Rx": "lib/Rx",
        "corejs": "lib/shim",
        "angular": "lib/angular"
    },
    shim: {
        "angular": {
            deps: ["Rx"],
            exports: "ng"
        }
    }
});

requirejs.defined

define.amd = false;
requirejs(["angular"], (angular) => {
    console.log("angular load complete", angular);
});