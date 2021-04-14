var Piece = require('./piece.js');
module.exports = class Board {
    constructor(canvas, wd, bd) {
        this.moves = [];
        this.layoutBoard();
        this.locked = false;
        if (canvas === undefined) {
            this.client = false;
        } else {
            this.client = true;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.wdctx = wd.getContext('2d');
            this.bdctx = bd.getContext('2d');
            this.tile = canvas.width / 8;
            canvas.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
            canvas.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
            canvas.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
            this.modalOpen = false;
        }
    }

    layoutBoard() {
        this.pieces = [
            new Piece("rook", "black", { x: 0, y: 0 }),
            new Piece("knight", "black", { x: 1, y: 0 }),
            new Piece("bishop", "black", { x: 2, y: 0 }),
            new Piece("king", "black", { x: 3, y: 0 }),
            new Piece("queen", "black", { x: 4, y: 0 }),
            new Piece("bishop", "black", { x: 5, y: 0 }),
            new Piece("knight", "black", { x: 6, y: 0 }),
            new Piece("rook", "black", { x: 7, y: 0 }),
            new Piece("pawn", "black", { x: 0, y: 1 }),
            new Piece("pawn", "black", { x: 1, y: 1 }),
            new Piece("pawn", "black", { x: 2, y: 1 }),
            new Piece("pawn", "black", { x: 3, y: 1 }),
            new Piece("pawn", "black", { x: 4, y: 1 }),
            new Piece("pawn", "black", { x: 5, y: 1 }),
            new Piece("pawn", "black", { x: 6, y: 1 }),
            new Piece("pawn", "black", { x: 7, y: 1 }),
            new Piece("rook", "white", { x: 0, y: 7 }),
            new Piece("knight", "white", { x: 1, y: 7 }),
            new Piece("bishop", "white", { x: 2, y: 7 }),
            new Piece("king", "white", { x: 3, y: 7 }),
            new Piece("queen", "white", { x: 4, y: 7 }),
            new Piece("bishop", "white", { x: 5, y: 7 }),
            new Piece("knight", "white", { x: 6, y: 7 }),
            new Piece("rook", "white", { x: 7, y: 7 }),
            new Piece("pawn", "white", { x: 0, y: 6 }),
            new Piece("pawn", "white", { x: 1, y: 6 }),
            new Piece("pawn", "white", { x: 2, y: 6 }),
            new Piece("pawn", "white", { x: 3, y: 6 }),
            new Piece("pawn", "white", { x: 4, y: 6 }),
            new Piece("pawn", "white", { x: 5, y: 6 }),
            new Piece("pawn", "white", { x: 6, y: 6 }),
            new Piece("pawn", "white", { x: 7, y: 6 }),
        ];
    }

    state() {
        return this.pieces;
    }

    evalulate() {
        for (var move of this.moves) {
            if (move.blockedBy !== undefined) {
                var blockingMove = this.moves.filter(m => m.start.x == move.blockedBy.x && m.start.y == move.blockedBy.y && !m.premove)[0];
                if (blockingMove !== undefined && (blockingMove.x != move.start.x || blockingMove.y != move.start.y)) {
                    move.blockedBy = undefined;
                } else {
                    if (move.premove) {
                        move.delete = true;
                        continue;
                    }
                    move.x = move.blockedBy.x;
                    move.y = move.blockedBy.y;
                    move.blockedBy = undefined;
                }
            }
        }
        this.moves = this.moves.filter(m => m.delete === undefined);

        var Battacking = false, Wattacking = false;
        var wMoves = this.moves.filter(m => m.color == "white");
        var bMoves = this.moves.filter(m => m.color == "black");

        for (var moveW of wMoves)
            if (!moveW.premove && this.pieces.filter(p => p.pos.x == moveW.x && p.pos.y == moveW.y).length > 0)
                Wattacking = true;

        for (var moveB of bMoves)
            if (!moveB.premove && this.pieces.filter(p => p.pos.x == moveB.x && p.pos.y == moveB.y).length > 0)
                Battacking = true;

        for (var moveW of wMoves) {
            for (var moveB of bMoves) {
                var pieceB = this.pieces.filter(p => p.pos.x == moveB.start.x && p.pos.y == moveB.start.y)[0];
                var pieceW = this.pieces.filter(p => p.pos.x == moveW.start.x && p.pos.y == moveW.start.y)[0];

                var wAttack = undefined;
                if (!moveW.premove)
                    wAttack = this.pieces.filter(p => p.pos.x == moveW.x && p.pos.y == moveW.y)[0];

                var bAttack = undefined;
                if (!moveB.premove)
                    bAttack = this.pieces.filter(p => p.pos.x == moveB.x && p.pos.y == moveB.y)[0];

                //Black is not attacking, this is black's premove, and white is attaching a piece 
                if (!Battacking && moveB.premove && wAttack !== undefined) {
                    //Black's premove is to where white is attacking
                    if (moveB.premove && moveB.x == moveW.x && moveB.y == moveW.y) {
                        wAttack.kill();
                        pieceW.kill();
                        if (moveB.upgrade != undefined) {
                            pieceB.name = moveB.upgrade;
                        }
                        pieceB.pos = {
                            x: moveB.x,
                            y: moveB.y
                        };
                        pieceB.hasMoved = true;
                        return;
                    }
                }
                if (!Wattacking && moveW.premove && bAttack !== undefined) {
                    if (moveW.premove && moveW.x == moveB.x && moveW.y == moveB.y) {
                        bAttack.kill();
                        pieceB.kill();
                        if (moveW.upgrade != undefined) {
                            pieceW.name = moveW.upgrade;
                        }
                        pieceW.pos = {
                            x: moveW.x,
                            y: moveW.y
                        };
                        pieceW.hasMoved = true;
                        return;
                    }
                }
            }
        }

        for (var moveW of wMoves) {
            for (var moveB of bMoves) {
                if (moveW.premove || moveB.premove)
                    continue;

                var pieceB = this.pieces.filter(p => p.pos.x == moveB.start.x && p.pos.y == moveB.start.y)[0];
                var pieceW = this.pieces.filter(p => p.pos.x == moveW.start.x && p.pos.y == moveW.start.y)[0];

                if (moveB.castle) {
                    if (moveW.x == moveB.x && moveW.y == moveB.y) {
                        console.log(move);
                        pieceB.kill();
                        pieceW.kill();
                        this.pieces[moveB.rookIndex].pos = {
                            x: moveB.rookX,
                            y: moveB.rookY
                        };
                        this.pieces[moveB.rookIndex].hasMoved = true;
                        console.log(this.pieces[moveB.rookIndex]);
                        return;
                    }
                    if (moveW.x == move.rookX && moveW.y == move.rookY) {
                        this.pieces[moveB.rookIndex].kill();
                        pieceW.kill();
                        pieceB.pos = {
                            x: moveB.x,
                            y: moveB.y
                        };
                        pieceB.hasMoved = true;
                        return;
                    }
                    this.pieces[moveB.rookIndex].pos = {
                        x: moveB.rookX,
                        y: moveB.rookY
                    };
                    this.pieces[moveB.rookIndex].hasMoved = true;
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceB.hasMoved = true;
                    if (wAttack !== undefined) {
                        wAttack.kill();
                    }
                    if (moveW.upgrade != undefined) {
                        pieceW.name = moveW.upgrade;
                    }
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    pieceW.hasMoved = true;
                    return;
                }

                if (moveW.castle) {
                    if (moveB.x == moveW.x && moveB.y == moveW.y) {
                        pieceB.kill();
                        pieceW.kill();
                        this.pieces[moveW.rookIndex].pos = {
                            x: moveW.rookX,
                            y: moveW.rookY
                        };
                        this.pieces[moveW.rookIndex].hasMoved = true;
                        return;
                    }
                    if (moveB.x == move.rookX && moveB.y == move.rookY) {
                        this.pieces[moveW.rookIndex].kill();
                        pieceB.kill();
                        pieceW.pos = {
                            x: moveW.x,
                            y: moveW.y
                        };
                        pieceW.hasMoved = true;
                        return;
                    }
                    this.pieces[moveW.rookIndex].pos = {
                        x: moveW.rookX,
                        y: moveW.rookY
                    };
                    this.pieces[moveW.rookIndex].hasMoved = true;
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    pieceW.hasMoved = true;
                    if (bAttack !== undefined) {
                        bAttack.kill();
                    }
                    if (moveB.upgrade != undefined) {
                        pieceB.name = moveB.upgrade;
                    }
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceB.hasMoved = true;
                    return;
                }

                if (moveB.x == moveW.x && moveB.y == moveW.y) {
                    pieceB.kill();
                    pieceW.kill();
                    return;
                }
                if (moveB.x == moveW.start.x && moveB.y == moveW.start.y && moveW.x == moveB.start.x && moveW.y == moveB.start.y) {
                    pieceB.kill();
                    pieceW.kill();
                    return;
                }
                else if (moveB.x == moveW.start.x && moveB.y == moveW.start.y) {
                    if (moveB.upgrade != undefined) {
                        pieceB.name = moveB.upgrade;
                    }
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceB.hasMoved = true;
                    if (moveW.upgrade != undefined) {
                        pieceW.name = moveW.upgrade;
                    }
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    pieceW.hasMoved = true;
                    if (wAttack !== undefined) {
                        wAttack.kill();
                    }
                    return;
                }
                else if (moveW.x == moveB.start.x && moveW.y == moveB.start.y) {
                    if (moveB.upgrade != undefined) {
                        pieceB.name = moveB.upgrade;
                    }
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceB.hasMoved = true;
                    if (moveW.upgrade != undefined) {
                        pieceW.name = moveW.upgrade;
                    }
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    pieceW.hasMoved = true;
                    if (bAttack !== undefined) {
                        bAttack.kill();
                    }
                    return;
                }
                if (bAttack !== undefined) {
                    bAttack.kill();
                }
                if (moveB.upgrade != undefined) {
                    pieceB.name = moveB.upgrade;
                }
                pieceB.pos = {
                    x: moveB.x,
                    y: moveB.y
                };
                pieceB.hasMoved = true;
                if (wAttack !== undefined) {
                    wAttack.kill();
                }
                if (moveW.upgrade != undefined) {
                    pieceW.name = moveW.upgrade;
                }
                pieceW.pos = {
                    x: moveW.x,
                    y: moveW.y
                };
                pieceW.hasMoved = true;
            }
        }
    }

    //CLIENT BOARD FUNCTION
    updateState(state) {
        for (var i in state) {
            this.pieces[i].pos = state[i].pos;
            this.pieces[i].move = undefined;
            if (state[i].dead === true) {
                this.pieces[i].dead = true;
            }
            this.pieces[i].hasMoved = state[i].hasMoved;
            this.pieces[i].name = state[i].name;
            this.pieces[i].setPiece();
        }
        this.moves = [];
        this.locked = false;
    }

    drawChessBoard() {
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                this.ctx.fillStyle = ((x + y) % 2 == 1) ? "#eeeed2" : "#769656";
                var ty = this.playerColor == "black" ? 7 - y : y;
                this.ctx.fillRect(x * this.tile, ty * this.tile, this.tile, this.tile);
            }
        }
        this.ctx.lineWidth = 4;
        if (this.dragging != undefined) {
            this.ctx.globalAlpha = .8;
            this.ctx.strokeStyle = "yellow";
            var ty = this.playerColor == "black" ? 7 - this.dragging.pos.y : this.dragging.pos.y;
            this.ctx.strokeRect(this.dragging.pos.x * this.tile + 6, ty * this.tile + 6, this.tile - 12, this.tile - 12);
            this.ctx.globalAlpha = 0.35;
            for (var move of this.legalMoves) {
                this.ctx.fillStyle = move.premove ? "red" : "green";
                var tmy = this.playerColor == "black" ? 7 - move.y : move.y;
                this.ctx.fillRect(move.x * this.tile, tmy * this.tile, this.tile, this.tile);
            }
        }
        for (var move of this.moves) {
            this.ctx.strokeStyle = move.premove ? "red" : "green";
            this.ctx.globalAlpha = .75;
            var tmy = this.playerColor == "black" ? 7 - move.y : move.y;
            this.ctx.strokeRect(move.x * this.tile + 6, tmy * this.tile + 6, this.tile - 12, this.tile - 12);
            this.ctx.globalAlpha = .4;
            var tmsy = this.playerColor == "black" ? 7 - move.start.y : move.start.y;
            this.ctx.strokeRect(move.start.x * this.tile + 6, tmsy * this.tile + 6, this.tile - 12, this.tile - 12);
        }
        this.ctx.globalAlpha = 1;

        this.wdctx.fillStyle = "#f5f5e7";
        this.wdctx.fillRect(0, 0, 100, 700);
        this.bdctx.fillStyle = "#f5f5e7";
        this.bdctx.fillRect(0, 0, 100, 700);

        var wHeight = 0, bHeight = 0;
        for (var piece of this.pieces) {
            if (piece.dead) {
                var dctx = this.bdctx;
                var height = bHeight;
                if (piece.color == "white") {
                    dctx = this.wdctx;
                    height = wHeight;
                    wHeight += 40;
                } else {
                    bHeight += 40;
                }
                piece.drawRaw(dctx, 25, height);
            }
        }
    }

    drawPieces() {
        for (var piece of this.pieces) {
            if (!piece.dead) {
                piece.draw(this.ctx, this.tile, this.playerColor == "white");
            }
        }
    }

    draw(e) {
        this.drawChessBoard();
        if (e !== undefined) {
            var hover = this.getTile(e);

            this.ctx.strokeStyle = "#627b48";
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(hover.x * this.tile + 2, hover.y * this.tile + 2, this.tile - 4, this.tile - 4);
        }
        this.drawPieces();
    }

    onMouseMove(e) {
        this.draw(e);
    }

    onMouseDown(e) {
        if (this.locked || this.modalOpen)
            return;
        this.dragging = this.getPiece(this.getTile(e, this.playerColor == "black"));
        if (this.dragging != undefined && this.dragging.color == this.playerColor) {
            this.moves = this.moves.filter(m => m !== this.dragging.move);
            this.dragging.move = undefined;
            this.legalMoves = this.dragging.getLegalMoves(this);
            if (this.moves.filter(m => !m.premove).length > 0) {
                this.legalMoves = this.legalMoves.filter(m => m.premove);
            }
            this.legalMoves = this.legalMoves.filter(m =>
                this.moves.filter(om => om.x === m.x && om.y === m.y).length == 0
            );
            this.draw(e);
        } else {
            this.dragging = undefined;
        }
    }

    onMouseUp(e) {
        if (this.dragging != undefined) {
            var hover = this.getTile(e, true);
            for (var move of this.legalMoves) {
                var ty = this.playerColor == "white" ? 7 - move.y : move.y;
                if (move.x == hover.x && ty == hover.y) {
                    move.start = this.dragging.pos;
                    move.color = this.dragging.color;
                    this.moves = this.moves.filter(m => !(m.start.x == move.x && m.start.y == move.y));
                    this.moves = this.moves.filter(m => !(m.x == move.start.x && m.y == move.start.y));

                    //clear other moves if this is attacking
                    if (this.contains(this.playerColor == "white" ? "black" : "white", { x: move.x, y: move.y })){
                        this.moves = this.moves.filter(m => !m.premove);
                    }
                    //clear attacking moves if this is a premove
                    if(move.premove){
                        this.moves = this.moves.filter(m => !this.contains(this.playerColor == "white" ? "black" : "white", { x: m.x, y: m.y }));
                    }

                    for (var piece of this.pieces) {
                        if (piece.move !== undefined && !this.moves.includes(piece.move))
                            piece.move = undefined;
                    }
                    if ((move.y == 0 || move.y == 7) && this.dragging.name == "pawn") {
                        document.getElementsByClassName('modal')[0].classList.add('open');
                        //move.upgrade = confirm("yo you want a queen or nah m9") ? "queen" : "knight";
                        this.modalOpen = true;
                    }
                    this.moves.push(move);
                    this.dragging.move = move;
                }
            }
        }
        this.dragging = undefined;
        this.legalMoves = [];
        this.draw(e);
    }

    getPiece(pos, flip = false) {
        for (var piece of this.pieces) {
            var ty = flip ? 7 - pos.y : pos.y;
            if (piece.pos.x == pos.x && piece.pos.y == ty) {
                return piece;
            }
        }
        return undefined;
    }

    getTile(e, flip = false) {
        var rawPos = this.getMousePos(e);
        if (this)
            return {
                x: Math.floor(rawPos.x / this.tile),
                y: flip ? 7 - Math.floor(rawPos.y / this.tile) : Math.floor(rawPos.y / this.tile)
            };
    }

    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    open(pos) {
        return this.inbound(pos) && this.getPiece(pos) == undefined;
    }

    contains(color, pos) {
        var p = this.getPiece(pos);
        return this.inbound(pos) && p != undefined && p.color == color;
    }

    inbound(pos) {
        return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
    }

}