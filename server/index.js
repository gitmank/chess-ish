// imports
const authController = require("./controllers/authController");

// load .env file
require("dotenv").config();

// socket.io server options
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = ""; // todo - update with deployed client url
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

// define namespaces
const defaultSpace = io.of("/");
const gameSpace = io.of("/game");
const chatSpace = io.of("/chat");

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
});

// authentication middleware
chatSpace.use((socket, next) => authController.verifyToken(socket, next));

// define chat channel events
chatSpace.on("connection", socket => {
    // ping test
    socket.on("ping", () => {
        socket.emit("ping-response", "pong");
    });
});