var app = require('app');  // Module to control application life.
var path = require('path');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var finalhandler = require('finalhandler');
var http = require('http')
var serveIndex = require('serve-index')
var serveStatic = require('serve-static')

// Serve directory indexes for public/ftp folder (with icons)
var index = serveIndex(path.join(__dirname, '/'), {'icons': true})

// Serve up public/ftp folder files
var serve = serveStatic(path.join(__dirname, '/'));

// Create server
var server = http.createServer(function onRequest(req, res){
    var done = finalhandler(req, res)
    serve(req, res, function onNext(err) {
        if (err) return done(err)
        index(req, res, done)
    })
})

// Listen
server.listen(3000)

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
    global['config'] = {
        html: 'preso.html',
        debug: false,
        slide: 1,
        frame: true,
        fullscreen: false
    }

    process.argv.forEach(function(arg) {
        var key = arg.split(':')[0];
        var value = arg.split(':')[1];

        if (value != "undefined" && value != undefined && value) {
            global['config'][key] = value;
            if (key == "debug" || key == "frame" || key == "fullscreen") {
                global['config'].debug = (global['config'].debug == "true") ? true:false;
                global['config'].frame = (global['config'].frame == "true") ? true:false;
                global['config'].fullscreen = (global['config'].fullscreen == "true") ? true:false;
            }
            console.log("Setting config." + key + " to " + value);
        }
    });


    // Create the browser window.
    mainWindow = new BrowserWindow( { frame: global['config'].frame, fullscreen: global['config'].fullscreen});

    var ipc = require('ipc');
    ipc.on('keyboardEvent', function(event, arg) {
        switch(arg.key) {
            case "S":
                secondaryWindow = new BrowserWindow({width: 800, height: 600});
                secondaryWindow.loadUrl('file://' + __dirname + '/stats.html' );
                secondaryWindow.on('closed', function() { secondaryWindow = null; });
                break;
            case "O":
                secondaryWindow = new BrowserWindow({width: 800, height: 600});
                secondaryWindow.loadUrl('file://' + __dirname + '/opencvdemo.html' );
                secondaryWindow.on('closed', function() { secondaryWindow = null; });
                break;
            case "D":
                if (arg.window == "main") {
                    mainWindow.openDevTools();
                } else {
                    secondaryWindow.openDevTools();
                }
                break;

            case "X":
                mainWindow.webContents.send('appClosed');
                mainWindow.close();
                if (secondaryWindow) { secondaryWindow.close(); }
                break;
        }
    });

    mainWindow.loadUrl('file://' + __dirname + '/' + global['config'].html );

    if (global['config'].debug) {
        mainWindow.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});