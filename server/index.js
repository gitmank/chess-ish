// imports
const authController = require("./controllers/authController");
const gameController = require("./controllers/gameController");

// load .env file
require("dotenv").config();

// socket.io server options
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = "http://localhost:3000"; // todo - update with deployed client url
const ALLOWED_METHODS = ["GET", "POST"];
const options = {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ALLOWED_METHODS,
    },
};

// initialize socket.io server from simple http server
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, options);
httpServer.listen(PORT);
console.log(`server listening on port ${PORT}`);

// define namespaces
const defaultSpace = io.of("/");
const gameSpace = io.of("/game");

// define default channel events
defaultSpace.on("connection", socket => {
    // ping test
    socket.on("ping", () => {
        socket.emit("ping-response", "pong");
    });
});

// authentication middleware
gameSpace.use((socket, next) => authController.verifyToken(socket, next));

// define game channel events
gameSpace.on("connection", socket => {
    // ping test
    socket.on("ping", () => {
        socket.emit("ping-response", "pong");
    });

    // list games for user
    socket.on("list-games", () => gameController.listGames(socket));
    // start game event
    socket.on("start-game", data => gameController.startGame(socket, data));
    // join game event
    socket.on("join-game", data => gameController.joinGame(socket, data));
    // set pieces event
    socket.on("set-pieces", data => gameController.setPieces(socket, data));
    // end game event
    socket.on("force-end-game", data => gameController.forceEndGame(socket, data));
    // chat message event
    socket.on("chat-message", data => {
        gameSpace.to(data.roomID).emit("new-chat-message", {
            username: socket.username,
            message: data.message,
        });
    });
    // make move event
    socket.on("make-move", data => gameController.makeMove(socket, data));
});