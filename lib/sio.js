var app = require('../app');
var http =require('http').Server(app);
var io = require('socket.io')();

var SerialPort = require('serialport').SerialPort;
var xbee_api = require("xbee-api");
var C = xbee_api.constants;

var frame_obj = {
    type: 0x01,
    id: 0x01,
    destination16:"4321",
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

    socket.on('webc_command', function (data) {
        socket.emit('pi_response', { ack: 'got it' });
        console.log('io.on-connection: ');
        console.log(data);
        console.log('=== will send above data ===');
        serialport.write(xbeeAPI.buildFrame(data));
    });
});

// Set serial port parameters to object
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate:19200,
    parser:xbeeAPI.rawParser()
});

// Open Serial Port and Write ascii
serialport.on('open', function() {
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Serialport open: Serial Port Opened.');
    console.log(xbeeAPI.buildFrame(frame_obj));
});

// Received frame from Arduino

xbeeAPI.on("frame_object", function(frame) {
    console.log("Send data to web client: >>", frame.data);
});


// Close Serial Port
serialport.on('close', function() {
    console.log('close: Serial Port closed');
});

module.exports = io;
