var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var _rooms = require('./src/room');
var Rooms = new _rooms(io);

app.use(express.static(__dirname + '/dist'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', (socket) => {
    socket.on('create', () => {
        Rooms.add(socket);
    });

    socket.on('room', (id) => {
        if (socket.rooms[id] == undefined && Rooms.available(id)) {
            Rooms.join(socket, id);
        } else {
            socket.emit('bad-room', id);
        }
    });

    socket.on('lockin', (moves) => {
        Rooms.lockIn(socket, moves);
    });

    socket.on('disconnect', () => {
        Rooms.disconnect(socket);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});