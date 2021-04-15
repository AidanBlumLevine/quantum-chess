import $ from 'jQuery'
import Board from './board.js';

var socket = io();
window.boringChess = true;

$(function () {
    var board;
    var canvas = $('#board')[0];
    var wd = $('#whitedead')[0];
    var bd = $('#blackdead')[0];

    window.oncontextmenu = function () {
        if ($('#lockin:visible').length > 0) {
            $('#lockin:visible').click();
            if ($('#lockin:visible').length == 0) {
                return false;
            }
        }
        return true;
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
        board = new Board(canvas, wd, bd);
        board.playerColor = data.color;
        board.modalOpen = true;
        board.drawChessBoard();
        board.drawPieces();
        $('#id').text(data.id);
        $('#new').hide();
        $('#input').hide();
        $('#lockin').show();
        $('#startmodal').addClass("open");
        $('#pregame').hide();
    });
    socket.on('start', () => {
        $('#startmodal').removeClass("open");
        board.modalOpen = false;
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
        if (board.moves.filter(m => !m.premove).length == 0 || $('.modal.open').length > 0)
            return;

        $(this).hide();
        board.locked = true;
        socket.emit('lockin', board.moves);
    });
    $('#new').on('click', function () {
        $(this).hide();
        socket.emit('create');
    });
    $('#queen').on('click', function () {
        board.moves[board.moves.length - 1].upgrade = "queen";
        $('#upgrademodal').removeClass('open');
        board.modalOpen = false;
    });
    $('#knight').on('click', function () {
        board.moves[board.moves.length - 1].upgrade = "knight";
        $('#upgrademodal').removeClass('open');
        board.modalOpen = false;
    });
});