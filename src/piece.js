module.exports = class Piece {
    constructor(name, color, pos) {
        this.name = name;
        this.color = color;
        this.pos = pos;
        this.hasMoved = false;
        if (name == "pawn") {
            this.startingPos = pos;
        }
        this.setPiece();
    }
    setPiece() {
        if(typeof document !== 'undefined')
            this.img = document.getElementById(this.color + this.name);
    }

    drawRaw(ctx, x, y) {
        ctx.drawImage(this.img, x, y, 50, 50);
    }

    draw(ctx, tile, flip = false) {
        if(flip){
            ctx.drawImage(this.img, this.pos.x * tile, this.pos.y * tile, tile, tile);
        } else {
            ctx.drawImage(this.img, this.pos.x * tile, (7-this.pos.y) * tile, tile, tile);
        }
    }

    getLegalMoves(board) {
        var moves = [];
        var otherColor = this.color == "black" ? "white" : "black";
        if (this.name == "pawn") {
            var dir = this.color == "black" ? 1 : -1;
            if (this.startingPos.x == this.pos.x && this.startingPos.y == this.pos.y) {
                if (board.open({ x: this.pos.x, y: this.pos.y + 2 * dir }) && board.open({ x: this.pos.x, y: this.pos.y + 1 * dir })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + 2 * dir });
                }
            }
            if (board.open({ x: this.pos.x, y: this.pos.y + dir })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dir });
            }
            if (board.contains(otherColor, { x: this.pos.x + 1, y: this.pos.y + dir })) {
                moves.push({ x: this.pos.x + 1, y: this.pos.y + dir });
            }
            if (board.contains(otherColor, { x: this.pos.x - 1, y: this.pos.y + dir })) {
                moves.push({ x: this.pos.x - 1, y: this.pos.y + dir });
            }
            if (board.contains(this.color, { x: this.pos.x + 1, y: this.pos.y + dir })) {
                moves.push({ x: this.pos.x + 1, y: this.pos.y + dir, premove: true });
            }
            if (board.contains(this.color, { x: this.pos.x - 1, y: this.pos.y + dir })) {
                moves.push({ x: this.pos.x - 1, y: this.pos.y + dir, premove: true });
            }
        }
        if (this.name == "rook") {
            var dist = 1;
            while (board.open({ x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist });

                var blocker = { x: this.pos.x, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }

            dist = 1;
            while (board.open({ x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist });

                var blocker = { x: this.pos.x, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y });

                var blocker = { x: this.pos.x + dist, y: this.pos.y };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y });

                var blocker = { x: this.pos.x - dist, y: this.pos.y };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, premove: true, blockedBy: blocker });
                }
            }

        }
        if (this.name == "bishop") {
            var dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist });

                var blocker = { x: this.pos.x + dist, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist });

                var blocker = { x: this.pos.x + dist, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist });

                var blocker = { x: this.pos.x - dist, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist });

                var blocker = { x: this.pos.x - dist, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }
        }
        if (this.name == "queen") {
            var dist = 1;
            while (board.open({ x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y + dist });

                var blocker = { x: this.pos.x, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }

            dist = 1;
            while (board.open({ x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x, y: this.pos.y - dist });

                var blocker = { x: this.pos.x, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y });

                var blocker = { x: this.pos.x + dist, y: this.pos.y };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y });

                var blocker = { x: this.pos.x - dist, y: this.pos.y };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y, premove: true, blockedBy: blocker });
                }
            }


            var dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y + dist });

                var blocker = { x: this.pos.x + dist, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x + dist, y: this.pos.y - dist });

                var blocker = { x: this.pos.x + dist, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x + dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x + dist, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y + dist });

                var blocker = { x: this.pos.x - dist, y: this.pos.y + dist };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y + dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y + dist, premove: true, blockedBy: blocker });
                }
            }


            dist = 1;
            while (board.open({ x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist });
                dist++;
            }
            if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, premove: true });
            }
            if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                moves.push({ x: this.pos.x - dist, y: this.pos.y - dist });

                var blocker = { x: this.pos.x - dist, y: this.pos.y - dist };
                dist++;
                while (board.open({ x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, blockedBy: blocker });
                    dist++;
                }
                if (board.contains(otherColor, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, blockedBy: blocker });
                }
                if (board.contains(this.color, { x: this.pos.x - dist, y: this.pos.y - dist })) {
                    moves.push({ x: this.pos.x - dist, y: this.pos.y - dist, premove: true, blockedBy: blocker });
                }
            }

        }
        if (this.name == "king") {
            var shifts = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: -1 },
                { x: 1, y: 1 },
            ]
            for (var shift of shifts) {
                if (board.open({ x: this.pos.x + shift.x, y: this.pos.y + shift.y }) || board.contains(otherColor, { x: this.pos.x + shift.x, y: this.pos.y + shift.y })) {
                    moves.push({ x: this.pos.x + shift.x, y: this.pos.y + shift.y });
                }
                if (board.contains(this.color, { x: this.pos.x + shift.x, y: this.pos.y + shift.y })) {
                    moves.push({ x: this.pos.x + shift.x, y: this.pos.y + shift.y, premove: true });
                }
            }
            if (!this.hasMoved && this.color == "black") {
                if (!board.pieces[0].hasMoved && board.open({ x: 1, y: 0 }) && board.open({ x: 2, y: 0 })) {
                    moves.push({ x: 1, y: 0, castle: true, rookX: 2, rookY: 0, rookIndex: 0 })
                }
                if (!board.pieces[7].hasMoved && board.open({ x: 4, y: 0 }) && board.open({ x: 5, y: 0 }) && board.open({ x: 6, y: 0 })) {
                    moves.push({ x: 5, y: 0, castle: true, rookX: 4, rookY: 0, rookIndex: 7 })
                }
            }
            if (!this.hasMoved && this.color == "white") {
                if (!board.pieces[16].hasMoved && board.open({ x: 1, y: 7 }) && board.open({ x: 2, y: 7 })) {
                    moves.push({ x: 1, y: 7, castle: true, rookX: 2, rookY: 7, rookIndex: 16 })
                }
                if (!board.pieces[23].hasMoved && board.open({ x: 4, y: 7 }) && board.open({ x: 5, y: 7 }) && board.open({ x: 6, y: 7 })) {
                    moves.push({ x: 5, y: 7, castle: true, rookX: 4, rookY: 7, rookIndex: 23 })
                }
            }
        }
        if (this.name == "knight") {
            var possibilities = [
                { x: 2, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: -1 },
                { x: 1, y: -2 },
                { x: -2, y: 1 },
                { x: -1, y: 2 },
                { x: -2, y: -1 },
                { x: -1, y: -2 },
            ]
            for (var shift of possibilities) {
                if (board.open({ x: this.pos.x + shift.x, y: this.pos.y + shift.y }) || board.contains(otherColor, { x: this.pos.x + shift.x, y: this.pos.y + shift.y })) {
                    moves.push({ x: this.pos.x + shift.x, y: this.pos.y + shift.y });
                }
                if (board.contains(this.color, { x: this.pos.x + shift.x, y: this.pos.y + shift.y })) {
                    moves.push({ x: this.pos.x + shift.x, y: this.pos.y + shift.y, premove: true });
                }
            }
        }
        return moves;
    }

    kill() {
        this.dead = true;
        this.pos.x = -47;
        this.pos.y = -47;
    }
}