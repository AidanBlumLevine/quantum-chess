import $ from 'jQuery'
import Board from './board.js';

var socket = io();
window.boringChess = true;

$(function () {
    var board;
    var canvas = $('canvas')[0];

    window.oncontextmenu = function () {
        if ($('#lockin:visible').length > 0) {
            $('#lockin:visible').click();
            return false;
        }
    }

    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('c')) {
        $('#input').val(searchParams.get('c'));
    }

    $('#input').on('input', function () {
        if ($(this).val().length >= 6) {
            socket.emit('room', $(this).val());
            $(this).val('');
        }
    });

    socket.on('connected', function (data) {
        board = new Board(canvas);
        board.playerColor = data.color;
        $('#id').text(data.id);
        $('#new').hide();
        $('#input').hide();
        $('#lockin').show();
    });
    socket.on('bad-room', function () {
        alert('Bad code');
    });
    socket.on('state', function (state) {
        board.updateState(state);
        board.draw();
        $('#lockin').show();
    });
    socket.on('closed', function () {
        alert('You win by forfeit');
    });

    $('#lockin').on('click', function () {
        if (board.moves.filter(m => !m.premove).length == 0)
            return;

        $(this).hide();
        board.locked = true;
        socket.emit('lockin', board.moves);
    });
    $('#new').on('click', function () {
        $(this).hide();
        socket.emit('create');
    });
});