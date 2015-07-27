var app = require('../app');
var db = require('../app').db;
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
//
// TODO: Need modify arduino Code for easy to debug
//
io.on('connection', function(socket) {
    
    socket.emit('pi_response', { hello: 'Contololler connected.' });

    socket.on('webc_command', function (data) {
        socket.emit('pi_response', { ack: 'got it' });
        console.log('== Data from web client ==');
        console.log('Below data received from web client will send to sensor device:');
        console.log(data);
        serialport.write(xbeeAPI.buildFrame(data));
    });
});

// Received frame from Sensor(Arduino) data
xbeeAPI.on("frame_object", function(frame) {
    console.log("Send data to web client: >>", frame.data);
    //db.collection('capdata').find().toArray(function(err, result){
    //    if (err) throw err;
    //    console.log(result);
    //});
});

// Set serial port parameters to object
var serialport = new SerialPort("/dev/ttyUSB0", {
    baudrate:19200,
    parser:xbeeAPI.rawParser()
});

// Open serial port and write ascii
serialport.on('open', function() {
    serialport.write(xbeeAPI.buildFrame(frame_obj));
    console.log('Open serial port.');
    console.log(xbeeAPI.buildFrame(frame_obj));
});

// Close Serial Port
serialport.on('close', function() {
    console.log('Close serial port.');
});

module.exports = io;