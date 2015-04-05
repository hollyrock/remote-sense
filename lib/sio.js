var app = require('../app');
var http =require('http').Server(app);
var io = require('socket.io')();

/*

function sio() {
    
    http.listen(app.get('port'), function() {
        console.log('listening!!!');
    });
    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            io.emit('chat message', msg);
        });
    });

    io.on('connection', function(socket){
        socket.emit('pi_response', {hello: 'worldA' });
        socket.on('webc_responce', function (data) {
            console.log('This is A');
            console.log(data);
        });
    });
}
*/

io.on('connection', function(socket) {
    socket.emit('pi_response', { hello: 'worldB' });
    socket.on('webc_response', function (data) {
        console.log('This is B');
        console.log(data);
    });
});

module.exports = io;
