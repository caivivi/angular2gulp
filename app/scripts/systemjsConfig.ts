declare const SystemJS: {
    config: (option: any) => void,
    import: (module: string) => void,
};

SystemJS.config({
    baseURL: "/",
    //transpiler: "typescript",
    paths: {
        
    },
    packages: {
        defaultExtension: "js"
    }
});