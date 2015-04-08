var app = require('../app');
var http =require('http').Server(app);
var io = require('socket.io')();

var SerialPort = require('serialport').SerialPort;
var xbee_api = require("xbee-api");
var C = xbee_api.constants;

var frame_obj = {
    type: 0x01,
    id: 0x01,
    destination16:"1234",
    options: 0x00,
    data: "I am global frame!"
};

// Use XBee as API mode
var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode:2
});

// Receive command from web browser with Socket.io
io.on('connection', function(socket) {
    socket.emit('pi_response', { hello: 'worldB' });
    socket.on('webc_response', function (data) {
        serialport.write(xbeeAPI.buildFrame(data)); //You need verify the data is surly following frame format
        console.log(data);          //debug
    });
});

// Set serial port parameters to object
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate:57600,
    parser:xbeeAPI.rawParser()
});

// Open Serial Port and Write ascii
serialport.on('open', function() {
/*
    var frame_obj = {
        type: 0x01,
        id: 0x01,
        destination16:"1234",
        options: 0x00,
        data: "Hello dear!"
    };
*/
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Serial Port Opened.');
    console.log('Blow frame is sent from app.js');
    console.log(xbeeAPI.buildFrame(frame_obj));
});

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function(frame) {
    console.log(">>", frame);
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

module.exports = io;
