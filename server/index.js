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

// ping test
io.on("connection", socket => {
    console.log("1 connected");
    socket.on("ping", () => {
        socket.emit("ping-response", "pong");
    });
    socket.on("disconnect", () => {
        console.log("1 disconnected");
    });
});

httpServer.listen(PORT);