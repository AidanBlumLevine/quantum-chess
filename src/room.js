const { v1: uuid } = require('uuid');
var Board = require('./board');
module.exports = class Rooms {
    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    add(owner) {
        if (owner.game !== undefined) { return; }
        var id = 0;
        while (id == 0 || this.find(id)) {
            id = Math.random().toString(36).slice(2, 8);
        }
        this.rooms.push({
            id: id,
            lockedIn: 0,
            participants: [{
                color: "white",
                socket: owner,
                userid: uuid(),
            }],
            board: new Board()
        });
        owner.game = this.find(id);
        owner.emit('connected', { id: id, color: "white" });
    }

    join(socket, id) {
        if (socket.game !== undefined) { return; }
        var room = this.find(id);
        room.participants.push({
            color: "black",
            socket: socket,
            userid: uuid(),
        });
        socket.emit('connected', { id: id, color: "black" });
        socket.game = room;
    }

    available(id) {
        return this.find(id) !== undefined && this.find(id).participants.length == 1;
    }

    find(id) {
        var found = undefined;
        this.rooms.forEach(room => {
            if (room.id == id) {
                found = room;
            }
        });
        return found;
    }

    lockIn(socket, moves) {
        socket.game.board.moves = socket.game.board.moves.concat(moves);
        socket.game.lockedIn++;
        if (socket.game.lockedIn == 2) {
            socket.game.lockedIn = 0;
            socket.game.board.evalulate();
            socket.game.board.moves = [];
            for (var p of socket.game.participants) {
                p.socket.emit('state', socket.game.board.state());
            }
        }
    }

    disconnect(socket) {
        if (socket.game !== undefined) {
            for (var p of socket.game.participants) {
                p.socket.emit('closed');
            }
            this.rooms = this.rooms.filter(item => item !== socket.game);
        }
    }
}