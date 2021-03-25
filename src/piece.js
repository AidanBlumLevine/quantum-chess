module.exports = class Piece {
    constructor(name, color, pos) {
        this.name = name;
        this.color = color;
        this.pos = pos;
        if (name == "pawn") {
            this.startingPos = pos;
        }
    }

    draw(ctx, tile) {
        ctx.font = tile * .7 + 'px serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (window.boringChess) {
            ctx.fillStyle = "#354525";
            ctx.font = tile * .9 + 'px serif';
            if (this.color == "black") {
                var text = '❌';
                if (this.name == "pawn")
                    text = '♟';
                if (this.name == "rook")
                    text = '♜';
                if (this.name == "bishop")
                    text = '♝';
                if (this.name == "knight")
                    text = '♞';
                if (this.name == "king")
                    text = '♚';
                if (this.name == "queen")
                    text = '♛';
            } else {
                if (this.name == "pawn")
                    text = '♙';
                if (this.name == "rook")
                    text = '♖';
                if (this.name == "bishop")
                    text = '♗';
                if (this.name == "knight")
                    text = '♘';
                if (this.name == "king")
                    text = '♔';
                if (this.name == "queen")
                    text = '♕';
            }
        } else {
            if (this.color == "black") {
                var text = '❌';
                if (this.name == "pawn")
                    text = '🦈';
                if (this.name == "rook")
                    text = '🐧';
                if (this.name == "bishop")
                    text = '🐬';
                if (this.name == "knight")
                    text = '🐡';
                if (this.name == "king")
                    text = '🐠';
                if (this.name == "queen")
                    text = '🐳';
            } else {
                if (this.name == "pawn")
                    text = '🦀';
                if (this.name == "rook")
                    text = '🐚';
                if (this.name == "bishop")
                    text = '🦑';
                if (this.name == "knight")
                    text = '🦐';
                if (this.name == "king")
                    text = '🐙';
                if (this.name == "queen")
                    text = '🦞';
            }
        }

        if (this.dead) {
            var text = '❌';
        }
        ctx.fillText(text, this.pos.x * tile + tile / 2, this.pos.y * tile + tile / 2 + 4);
    }

    getLegalMoves(board) {
        var moves = [];
        var otherColor = this.color == "black" ? "white" : "black";
        if (this.name == "pawn") {
            var dir = this.color == "black" ? 1 : -1;
            if (this.startingPos.x == this.pos.x && this.startingPos.y == this.pos.y) {
                if (board.open({ x: this.pos.x, y: this.pos.y + 2 * dir })) {
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