var Piece = require('./piece.js');
module.exports = class Board {
    constructor(canvas) {
        this.moves = [];
        this.layoutBoard();
        if (canvas === undefined) {
            this.client = false;
        } else {
            this.client = true;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.tile = canvas.width / 8;
            this.drawChessBoard();
            this.drawPieces();
            canvas.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
            canvas.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
            canvas.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
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
        var Battacking = false, Wattacking = false;
        for (var moveW of this.moves) {
            if (moveW.color == "black" || moveW.premove)
                continue;
            if (this.pieces.filter(p => p.pos.x == moveW.x && p.pos.y == moveW.y).length > 0) {
                Wattacking = true;
            }
        }
        for (var moveB of this.moves) {
            if (moveB.color == "white" || moveW.premove)
                continue;
            var bAttack = this.pieces.filter(p => p.pos.x == moveB.x && p.pos.y == moveB.y)[0];
            if (this.pieces.filter(p => p.pos.x == moveB.x && p.pos.y == moveB.y).length > 0) {
                Battacking = true;
            }
        }


        for (var moveW of this.moves) {
            if (moveW.color == "black")
                continue;

            for (var moveB of this.moves) {
                if (moveB.color == "white")
                    continue;

                var pieceB = this.pieces.filter(p => p.pos.x == moveB.start.x && p.pos.y == moveB.start.y)[0];
                var pieceW = this.pieces.filter(p => p.pos.x == moveW.start.x && p.pos.y == moveW.start.y)[0];

                var wAttack;
                if (!moveW.premove) {
                    wAttack = this.pieces.filter(p => p.pos.x == moveW.x && p.pos.y == moveW.y)[0];
                }
                var bAttack;
                if (!moveB.premove) {
                    bAttack = this.pieces.filter(p => p.pos.x == moveB.x && p.pos.y == moveB.y)[0];
                }
                if (!Battacking && moveB.premove) {
                    if (!moveW.premove && wAttack !== undefined) {
                        if (moveB.premove && moveB.x == moveW.x && moveB.y == moveW.y) {
                            wAttack.kill();
                            pieceW.kill();
                            pieceB.pos = {
                                x: moveB.x,
                                y: moveB.y
                            };
                            return;
                        }
                    }
                }
                if (!Wattacking && moveW.premove) {
                    if (!moveB.premove && bAttack !== undefined) {
                        if (moveW.premove && moveW.x == moveB.x && moveW.y == moveB.y) {
                            bAttack.kill();
                            pieceB.kill();
                            pieceW.pos = {
                                x: moveW.x,
                                y: moveW.y
                            };
                            return;
                        }
                    }
                }
            }
        }
        for (var moveW of this.moves) {
            if (moveW.color == "black")
                continue;

            for (var moveB of this.moves) {
                if (moveB.color == "white" || moveW.premove || moveB.premove)
                    continue;

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
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    if (wAttack !== undefined) {
                        wAttack.kill();
                    }
                    return;
                }
                else if (moveW.x == moveB.start.x && moveW.y == moveB.start.y) {
                    pieceB.pos = {
                        x: moveB.x,
                        y: moveB.y
                    };
                    pieceW.pos = {
                        x: moveW.x,
                        y: moveW.y
                    };
                    if (bAttack !== undefined) {
                        bAttack.kill();
                    }
                    return;
                }
                if (bAttack !== undefined) {
                    bAttack.kill();
                }
                pieceB.pos = {
                    x: moveB.x,
                    y: moveB.y
                };
                if (wAttack !== undefined) {
                    wAttack.kill();
                }
                pieceW.pos = {
                    x: moveW.x,
                    y: moveW.y
                };
            }
        }
    }

    //CLIENT BOARD FUNCTION
    updateState(state) {
        for (var i in state) {
            this.pieces[i].pos = state[i].pos;
            this.pieces[i].move = undefined;
        }
        this.moves = [];
    }

    drawChessBoard() {
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                this.ctx.fillStyle = ((x + y) % 2 == 1) ? "#eeeed2" : "#769656";
                this.ctx.fillRect(x * this.tile, y * this.tile, this.tile, this.tile);
            }
        }
        this.ctx.lineWidth = 4;
        if (this.dragging != undefined) {
            this.ctx.globalAlpha = .8;
            this.ctx.strokeStyle = "yellow";
            this.ctx.strokeRect(this.dragging.pos.x * this.tile + 6, this.dragging.pos.y * this.tile + 6, this.tile - 12, this.tile - 12);
            this.ctx.globalAlpha = 0.35;
            for (var move of this.legalMoves) {
                this.ctx.fillStyle = move.premove ? "red" : "green";
                this.ctx.fillRect(move.x * this.tile, move.y * this.tile, this.tile, this.tile);
            }
        }
        this.ctx.globalAlpha = .75;
        for (var move of this.moves) {
            this.ctx.strokeStyle = move.premove ? "red" : "green";
            this.ctx.strokeRect(move.x * this.tile + 6, move.y * this.tile + 6, this.tile - 12, this.tile - 12);
            this.ctx.strokeRect(move.start.x * this.tile + 6, move.start.y * this.tile + 6, this.tile - 12, this.tile - 12);
        }
        this.ctx.globalAlpha = 1;
    }

    drawPieces() {
        for (var piece of this.pieces) {
            piece.draw(this.ctx, this.tile);
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
        this.dragging = this.getPiece(this.getTile(e));
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
            var hover = this.getTile(e);
            for (var move of this.legalMoves) {
                if (move.x == hover.x && move.y == hover.y) {
                    move.start = this.dragging.pos;
                    move.color = this.dragging.color;
                    this.moves.push(move);
                    this.dragging.move = move;
                }
            }
        }
        this.dragging = undefined;
        this.legalMoves = [];
        this.draw(e);
    }

    getPiece(pos) {
        for (var piece of this.pieces) {
            if (piece.pos.x == pos.x && piece.pos.y == pos.y) {
                return piece;
            }
        }
        return undefined;
    }

    getTile(e) {
        var rawPos = this.getMousePos(e);
        return {
            x: Math.floor(rawPos.x / this.tile),
            y: Math.floor(rawPos.y / this.tile)
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