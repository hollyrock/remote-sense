var socket = io.connect('http://' + location.host + '/');

socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', {pi: 'control'});
});

