var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
	api_mode: 2
});

var serialport = new SerialPort("/dev/ttyUSB0", {
	baudrate: 57600,
	parser: xbeeAPI.rawParser()
});

serialport.on("open",function() {
	var frame_obj = {
		type: 0x01,
		id: 0x01,
		destination16: "1234",
		options: 0x00,
		data: "Hello dear!"
	};

	serialport.write(xbeeAPI.buildFrame(frame_obj));
	console.log(xbeeAPI.buildFrame(frame_obj));
});

xbeeAPI.on("frame_object", function(frame) {
	console.log(">>", frame);
});

