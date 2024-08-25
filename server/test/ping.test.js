// load .env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// import socket.io-client
const io = require("socket.io-client");

// attempt to connect to socket.io server
try {
    var socket = io(`http://localhost:${PORT}`, {
        timeout: 5000,
        reconnection: false,
    });
    console.log("⏳ connecting to server");
} catch (error) {
    console.error("🔴 connection error:", error.toString());
    process.exit(1);
}

// handle connection errors
socket.on("connect_error", error => {
    console.error("🔴 connection error", error.toString());
    socket.disconnect();
});

// ping test
socket.on("connect", () => {
    console.log("✅ connected to server");
    socket.emit("ping");
    socket.on("ping-response", response => {
        if (response !== "pong") {
            console.error("🔴 unexpected response:", response);
        } else {
            console.log("✅ received response:", response);
        }
        socket.disconnect();
    });
});