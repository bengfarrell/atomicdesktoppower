var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var secondaryWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1200, height: 800});

    global['config'] = {
        html: 'index.html',
        debug: false,
        slide: 1
    }

    var ipc = require('ipc');
    ipc.on('keyboardEvent', function(event, arg) {
        switch(arg.key) {
            case "S":
                secondaryWindow = new BrowserWindow({width: 800, height: 300});
                secondaryWindow.loadUrl('file://' + __dirname + '/stats.html' );
                secondaryWindow.on('closed', function() { secondaryWindow = null; });
                break;
            case "D":
                if (arg.window == "main") {
                    mainWindow.openDevTools();
                } else {
                    secondaryWindow.openDevTools();
                }
                break;
        }
    });

    process.argv.forEach(function(arg) {
        var key = arg.split(':')[0];
        var value = arg.split(':')[1];

        if (value != "undefined" && value != undefined && value) {
            global['config'][key] = value;
            console.log("Setting config." + key + " to " + value);
        }
    });

    // type co-erce
    if (global['config'].debug == "true") {
        global['config'].debug = true;
    } else {
        global['config'].debug = false;
    }

    mainWindow.loadUrl('file://' + __dirname + '/' + global['config'].html );

    if (global['config'].debug) {
        mainWindow.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() { mainWindow = null; });
});