var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//
/// MongoDB Code
//

// Preparing for MongoDB access module. Make connection to sensedevice db
var mongo =require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/sensedevice", {native_parser:true});


//
/// Web Server setup
//

// route setup
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// Make our db accessible to our router
// This code enable to return DB query by http://localhost:port/users/capdata
app.use(function(req, res, next){
    req.db = db;
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment after placng your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// error handlers
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//
/// XBee, Serial port Code
/// Connect Raspberry Pi to Arduino with XBee (API)
//

var SerialPort = require('serialport').SerialPort;
var xbee_api = require("xbee-api");
var C = xbee_api.constants;

// Use XBee as API mode
var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode:2
});

// Set port parameters to object
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate:57600,
    parser:xbeeAPI.rawParser()
});

// Open Serial Port
serialport.on('open', function() {
    var frame_obj = {
        type: 0x01,
        id: 0x01,
        destination16:"1234",
        options: 0x00,
        data: "Hello dear!"
    };

    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Serial Port Opened.');
    console.log('Blow frame is sent from app.js');
    console.log(xbeeAPI.buildFrame(frame_obj));
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function(frame) {
    //console.log(">>", frame);
});

// Close Serial Port
serialport.on('close', function() {
    console.log('Serial Port closed');
});

// Receive Data from Serial Port
serialport.on('data', function(input) {
    var buf = new Buffer(input, 'utf8');
    var jData;
    try {
        jData = JSON.parse(buf);
        console.log('Device Name: ' + jData.unitname);
        }catch(e) {
            console.log('Something wrong on received Data..');
            return;
        }

});

module.exports = app;