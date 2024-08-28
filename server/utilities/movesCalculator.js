const ALLOWED_MOVES = {
    P1: [[0, 1], [1, 0], [0, -1], [-1, 0]],
    P2: [[0, 1], [1, 0], [0, -1], [-1, 0]],
    P3: [[0, 1], [1, 0], [0, -1], [-1, 0]],
    H1: [[0, 2], [2, 0], [0, -2], [-2, 0]],
    H2: [[2, 2], [2, -2], [-2, 2], [-2, -2]],
};

const KILL_TYPES = {
    P1: "destination",
    P2: "destination",
    P3: "destination",
    H1: "path",
    H2: "path",
}

const movesCalculator = (selectedPiece, pieces) => {
    const validMoves = [];
    const piecesTaken = [];
    const allowedMoves = ALLOWED_MOVES[selectedPiece.type];

    allowedMoves.forEach((move) => {
        const [x, y] = move;
        // for destination kill type, calculate grid piece will land at
        if (KILL_TYPES[selectedPiece.type] === "destination") {
            const newX = selectedPiece.location[0] + x;
            const newY = selectedPiece.location[1] + y;
            // check destination out of board
            if (newX < 0 || newX > 4 || newY < 0 || newY > 4) {
                return;
            }
            const destination = pieces.filter((p) => {
                if (p.location[0] === newX && p.location[1] === newY) {
                    return p;
                }
            })[0];

            // check if destination is occupied by own piece
            if (destination && destination.owner !== selectedPiece.owner) {
                validMoves.push([newX, newY]);
                piecesTaken.push(destination);
            }
            if (!destination) {
                validMoves.push([newX, newY]);
            }
        }
        if (KILL_TYPES[selectedPiece.type] === "path") {
            // loop from current location to destination
            let newX = selectedPiece.location[0] + x;
            let newY = selectedPiece.location[1] + y;
            if (newX < 0 || newX > 4 || newY < 0 || newY > 4) {
                return;
            }
            if (newX > x) {
                for (let i = newX; i > x; i--) {
                    const affectedPiece = pieces.filter((p) => {
                        if (p.location[0] === i && p.location[1] === newY) {
                            return p;
                        }
                    })[0];
                    if (affectedPiece && affectedPiece.owner === selectedPiece.owner) {
                        return;
                    }
                }
            }
            if (newX < x) {
                for (let i = newX; i < x; i++) {
                    const affectedPiece = pieces.filter((p) => {
                        if (p.location[0] === i && p.location[1] === newY) {
                            return p;
                        }
                    })[0];
                    if (affectedPiece && affectedPiece.owner === selectedPiece.owner) {
                        return;
                    }
                }
            }
            if (newY > y) {
                for (let i = newY; i > y; i--) {
                    const affectedPiece = pieces.filter((p) => {
                        if (p.location[0] === newX && p.location[1] === i) {
                            return p;
                        }
                    })[0];
                    console.log(affectedPiece);
                    if (affectedPiece && affectedPiece.owner === selectedPiece.owner) {
                        return;
                    }
                }
            }
            if (newY < y) {
                for (let i = newY; i < y; i++) {
                    const affectedPiece = pieces.filter((p) => {
                        if (p.location[0] === newX && p.location[1] === i) {
                            return p;
                        }
                    })[0];
                    console.log(affectedPiece);
                    if (affectedPiece && affectedPiece.owner === selectedPiece.owner) {
                        return;
                    }
                }
            }
            const destination = pieces.filter((p) => {
                if (p.location[0] === newX && p.location[1] === newY) {
                    return p;
                }
            })[0];
            if (destination && destination.owner !== selectedPiece.owner) {
                validMoves.push([newX, newY]);
                piecesTaken.push(destination);
            }
            if (!destination) {
                validMoves.push([newX, newY]);
            }
        }
    });
    return [validMoves, piecesTaken];
};

module.exports = movesCalculator;