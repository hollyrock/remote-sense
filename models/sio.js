var socketio = require('socket.io');

module.exports = sio;

function sio(server) {
    
    var sio = socketio.listen(server);
    sio.set('transports', ['websocket']);

    // Connect Socket
    sio.sockets.on('connection', function(socket) {

        // Receiving data from xbee
        socket.on('notice', function(socket) {

            // Broadcast received data
            socket.broadcast.emit('receive', {
            
                // Data JSON

            });
        });

        socket.on("disconnect", function() {
        });
    });

}

