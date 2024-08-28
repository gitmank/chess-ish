const connectToMongo = require("../utilities/connectToDB");
const Game = require("../models/GameModel");
const Piece = require("../models/PieceModel");
const movesCalculator = require("../utilities/movesCalculator");
const uuidv4 = require("uuid").v4;

// start a new game
const startGame = async (socket, data) => {
    try {
        await connectToMongo();

        // validate user has no open games
        const userGame = await Game.find({ players: socket.username, endedAt: null });
        if (userGame.length) {
            socket.emit("start-game-response", {
                status: "error",
                message: `already in a game - ${userGame[0].name}`,
                roomID: userGame[0].uuid,
            });
            return;
        }

        // create new game
        const newGame = new Game({
            uuid: uuidv4(),
            name: data.roomName,
            players: [socket.username],
            currentTurn: socket.username,
        });
        await newGame.save();

        // send response
        socket.emit("start-game-response", {
            status: "success",
            message: `You can join - ${newGame.name}`,
            roomID: newGame.uuid,
        });
    } catch (error) {
        console.log("error starting game:", error.toString());
        socket.emit("start-game-response", {
            status: "error",
            message: "error starting game",
            roomID: "",
        });
    }
};

const joinGame = async (socket, data) => {
    try {
        await connectToMongo();

        // find game by uuid
        const game = await Game.findOne({ uuid: data.uuid });
        if (!game || game.endedAt) {
            socket.emit("join-game-response", {
                status: "error",
                message: "game invalid or closed",
                roomID: data.uuid,
            });
            return;
        }

        // rejoin if user is in game
        if (game.players.includes(socket.username)) {
            socket.join(game.uuid);
            socket.emit("join-game-response", {
                status: "success",
                message: `joined - ${game.name}`,
                roomID: game.uuid,
                game: game,
                pieces: await Piece.find({ game: game.uuid }),
            });
            return;
        }

        // check if user has open games
        const userGame = await Game.find({ players: socket.username, endedAt: null });
        if (userGame.length) {
            socket.emit("join-game-response", {
                status: "error",
                message: `already in a game - ${userGame[0].name}`,
                roomID: userGame[0].uuid,
            });
            return;
        }

        // check if game is full
        if (game.players.length === 2) {
            socket.emit("join-game-response", {
                status: "error",
                message: "game full, try spectate",
                roomID: data.uuid,
            });
            return;
        }

        // check if user is in game
        if (game.players.includes(socket.username)) {
            socket.join(game.uuid);
        } else {
            // or add user to game
            game.players.push(socket.username);
            await game.save();
            socket.join(game.uuid);
        }

        // fetch all pieces
        const pieces = await Piece.find({ game: game.uuid });

        // send response
        socket.emit("join-game-response", {
            status: "success",
            message: `joined - ${game.name}`,
            roomID: game.uuid,
            game: game,
            pieces: pieces,
        });

        // send update to all in room
        socket.to(game.uuid).emit("join-game-response", {
            status: "success",
            message: `${socket.username} joined - ${game.name}`,
            roomID: game.uuid,
            game: game,
            pieces: pieces,
        });

    } catch (error) {
        console.log("error joining game:", error.toString());
        socket.emit("join-game-response", {
            status: "error",
            message: "error joining game",
            roomID: data.uuid,
        });
    }
}

const listGames = async (socket) => {
    try {
        await connectToMongo();

        // find all open games
        const games = await Game.find({ players: socket.username });
        socket.emit("list-games-response", {
            status: "success",
            message: "games found",
            games: games,
        });
    } catch (error) {
        console.log("error listing games:", error.toString());
        socket.emit("list-games-response", {
            status: "error",
            message: "error listing games",
            games: [],
        });
    }
}

const setPieces = async (socket, data) => {
    try {
        await connectToMongo();

        // find game by uuid
        const game = await Game.findOne({ uuid: data.uuid });
        if (!data.pieces || data.pieces.length !== 5 || !game || game.endedAt) {
            socket.emit("set-pieces-response", {
                status: "error",
                message: "pices or game invalid",
                roomID: data.uuid,
            });
            return;
        }

        // check if user has pieces
        const existingPieces = await Piece.find({ game: game.uuid });
        const userExistingPieces = existingPieces.filter(p => p.owner === socket.username);
        if (userExistingPieces.length) {
            socket.emit("set-pieces-response", {
                status: "error",
                message: "pieces already set",
                roomID: data.uuid,
                pieces: existingPieces,
            });
            return;
        }

        // check if user is in game
        if (!game.players.includes(socket.username)) {
            socket.emit("set-pieces-response", {
                status: "error",
                message: "action not allowed",
                roomID: data.uuid,
            });
            return;
        }

        // validate pieces
        const ALLOWED_PIECES = ["P1", "P2", "H1", "H2", "P3"].sort();
        const userPieces = [...data.pieces].sort();
        if (ALLOWED_PIECES.join("") !== userPieces.join("")) {
            socket.emit("set-pieces-response", {
                status: "error",
                message: "invalid pieces",
                roomID: data.uuid,
            });
            return;
        }

        // create pieces
        const userStartRow = game.players.indexOf(socket.username) === 0 ? 0 : 4;
        for (let i = 0; i < data.pieces.length; i++) {
            const newPiece = new Piece({
                game: game.uuid,
                name: data.pieces[i],
                owner: socket.username,
                type: data.pieces[i],
                location: [userStartRow, i],
            });
            await newPiece.save();
            game.moves.push({ player: socket.username, piece: data.pieces[i], location: [userStartRow, i] });
            await game.save();
        }

        // fetch all pieces
        const pieces = await Piece.find({ game: game.uuid });

        // send response
        socket.emit("update-pieces", {
            status: "success",
            message: "pieces set",
            roomID: game.uuid,
            pieces: pieces,
        });

        // send update to all in room
        socket.to(game.uuid).emit("update-pieces", {
            status: "success",
            message: `${socket.username} set pieces`,
            roomID: game.uuid,
            pieces: pieces,
        });

        // send game update to room
        const latestGame = await Game.findOne({ uuid: game.uuid });
        socket.to(game.uuid).emit("update-game", {
            status: "success",
            message: `${socket.username} set pieces`,
            roomID: game.uuid,
            game: latestGame,
        });

        // send game update to current socket
        socket.emit("update-game", {
            status: "success",
            message: "pieces set",
            roomID: game.uuid,
            game: latestGame,
        });

    } catch (error) {
        console.log("error setting pieces:", error.toString());
        socket.emit("set-pieces-response", {
            status: "error",
            message: "error setting pieces",
            roomID: data.uuid,
        });
    }
}

const forceEndGame = async (socket, data) => {
    try {
        await connectToMongo();
        await Game.updateOne({ uuid: data.uuid }, { endedAt: new Date().toISOString(), winner: "force-ended" });
        const games = await Game.find({ players: socket.username });
        socket.emit("list-games-response", {
            status: "success",
            message: "games found",
            games: games,
        });
        const game = games.filter(g => g.uuid === data.uuid)[0];
        socket.to(game.uuid).emit("update-game", {
            status: "success",
            message: "game ended",
            roomID: data.uuid,
            game: game,
        });
    } catch (error) {
        console.log("error ending game:", error.toString());
        socket.emit("force-end-game-response", {
            status: "error",
            message: "error ending game",
            roomID: data.uuid,
        });
    }
}

const makeMove = async (socket, data) => {
    try {
        await connectToMongo();
        // find game by uuid
        const game = await Game.findOne({ uuid: data.uuid });
        if (!game || game.endedAt) {
            socket.emit("make-move-response", {
                status: "error",
                message: "game invalid or closed",
                roomID: data.uuid,
            });
            return;
        }

        // check if user is in game
        if (!game.players.includes(socket.username)) {
            socket.emit("make-move-response", {
                status: "error",
                message: "action not allowed",
                roomID: data.uuid,
            });
            return;
        }

        // check if it's user's turn
        if (game.currentTurn !== socket.username) {
            socket.emit("make-move-response", {
                status: "error",
                message: "not your turn",
                roomID: data.uuid,
            });
            return;
        }

        // check if piece belongs to user
        const piece = await Piece.findOne({ game: game.uuid, name: data.piece.name, owner: socket.username });
        if (!piece || piece.owner !== socket.username) {
            socket.emit("make-move-response", {
                status: "error",
                message: "invalid piece",
                roomID: data.uuid,
            });
            return;
        }

        // check if move is valid
        const pieces = await Piece.find({ game: game.uuid });
        const [moves, piecesTaken] = movesCalculator(piece, pieces);
        piecesTaken.map(async (piece) => {
            if (piece.location[0] === data.location[0] && piece.location[1] === data.location[1]) {
                await Piece.deleteOne(piece);
            }
        })
        const move = moves.filter(m => m[0] === data.location[0] && m[1] === data.location[1]);
        if (!move.length) {
            socket.emit("make-move-response", {
                status: "error",
                message: "invalid move",
                roomID: data.uuid,
            });
            return;
        }

        // update piece location
        await Piece.updateOne({ game: game.uuid, name: piece.name, owner: piece.owner }, { location: data.location });

        // update game turn
        const nextTurn = game.players.filter(p => p !== game.currentTurn)[0];
        await Game.updateOne({ uuid: data.uuid }, { currentTurn: nextTurn });

        // send response
        socket.emit("make-move-response", {
            status: "success",
            message: "move made",
            roomID: data.uuid,
        });

        const latestPieces = await Piece.find({ game: game.uuid });

        // send update to current socket 
        socket.emit("update-pieces", {
            status: "success",
            message: `${socket.username} made move`,
            roomID: game.uuid,
            pieces: latestPieces,
        })

        // send update to all in room
        socket.to(game.uuid).emit("update-pieces", {
            status: "success",
            message: `${socket.username} made move`,
            roomID: game.uuid,
            pieces: latestPieces,
        });

        // send game update to room
        const latestGame = await Game.findOne({ uuid: game.uuid });
        socket.to(game.uuid).emit("update-game", {
            status: "success",
            message: `${socket.username} made move`,
            roomID: game.uuid,
            game: latestGame,
        });

        // update moves 
        await Game.updateOne({ uuid: data.uuid }, { moves: [...game.moves, { player: socket.username, piece: piece.name, location: data.location }] });

        // check game won
        const gamePieces = latestPieces.filter(p => p.owner === socket.username);
    }
    catch (error) {
        console.log("error making move:", error.toString());
        socket.emit("make-move-response", {
            status: "error",
            message: "error making move",
            roomID: data.uuid,
        });
    }
}

module.exports = {
    startGame,
    joinGame,
    listGames,
    setPieces,
    forceEndGame,
    makeMove,
};