const packageJson = require('./package.json');
const { app, BrowserWindow, Menu, protocol, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

//locations
const locationPrefix = __dirname, distFolder = "dist/";
const rawUrl = path.join(locationPrefix, distFolder);

//options
const windowOption = {
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    center: true,
    transparent: false,
    backgroundColor: "#fff",
    titleBarStyle: "default",
    title: packageJson.name,
    webPreferences: {
        webSecurity: true,
        experimentalFeatures: true,
        experimentalCanvasFeatures: true,
        nodeIntegrationInWorker: true
    }
};
const urlFormatOption = {
    pathname: "index.html",
    protocol: "file",
    slashes: true
};
const menuTemplate = [
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            // { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            // { role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            // { role: 'reload' },
            // { role: 'forcereload' },
            // { role: 'toggledevtools' },
            // { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { label: 'Maximize', accelerator: 'CmdOrCtrl+`', click() { win.maximize(); } },
            { label: 'Restore', accelerator: 'CmdOrCtrl+R', click() { win.restore(); } },
            { role: 'close' },
            { label: 'alert', click() { win.webContents.executeJavaScript(`alert("囧冏浻綗烱埛");`); } }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { shell.openExternal('https://github.com/andy5638/angular2gulp'); }
            },
            {
                label: 'Check Update',
                click() { checkUpdate(); }
            }
        ]
    }
];

// initializations
let win;
const appVersion = app.getVersion();
autoUpdater.autoDownload = true;
autoUpdater.allowDowngrade = false;

app.on("ready", onAppReady)
    .on("activate", () => !win && createWindow())
    .on("window-all-closed", () => app.quit());



autoUpdater.on("error", (err) => {
    autoUpdater.logger.error("Error occurred when updating application");
    autoUpdater.logger.error(err);
}).on("update-available", (info) => {
    autoUpdater.logger.info("There is an update available for application");
    autoUpdater.logger.info(info);
}).on("update-not-available", (info) => {
    autoUpdater.logger.info("There is no update available for application");
    autoUpdater.logger.info(info);
}).on("download-progress", ({ bytesPerSecond, percent, total, transferred }) => {
    autoUpdater.logger.info("Downloading");
    autoUpdater.logger.info(percent);
}).on("update-downloaded", (info) => {
    autoUpdater.logger.info("Download complete.");
});

//functions
function onAppReady() {
    protocol.interceptFileProtocol("file", (request, callback) => {
        let url = path.join(rawUrl, request.url.substr(7));
        callback({ path: url });
    }, (err) => !!err && console.log("Error occurred while intercepting protocol", err));

    createWindow();
}

function createWindow() {
    win = new BrowserWindow(windowOption);
    
    /* for dev */
    win.webContents.openDevTools();
    win.maximize();
    /* end */

    win.setMenu(Menu.buildFromTemplate(menuTemplate));
    //win.setMenu(null);
    win.loadURL(url.format(urlFormatOption));
    win.on("closed", () => win = null);

    return win;
}

async function checkUpdate() {
    let { versionInfo, fileInfo, downloadPromise, cancellationToken } = await autoUpdater.checkForUpdates();

    if (canUpdate()) {
        await downloadPromise(cancellationToken);
    }
}

function canUpdate() {
    return false;
}