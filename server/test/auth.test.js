// load .env file
require("dotenv").config();

// test options
const PORT = process.env.PORT || 4000;
const VALID_PING_RESPONSE = "pong";
const VALID_AUTH_ERROR = "Authentication error";
const VALID_USERNAME = "test";
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');
const VALID_TOKEN = jwt.sign({ username: VALID_USERNAME }, JWT_SECRET, { expiresIn: '1m' });

// namespaces to test
const NAMESPACES = ["", "game", "chat"];

// import socket.io-client
const io = require("socket.io-client");

// test connection to default namespace
const test_connection = (namespace, token = "") => {
    try {
        var socket = io(`http://localhost:${PORT}/${namespace}`, {
            timeout: 5000,
            reconnection: false,
            auth: { token },
        });

        // handle connection errors
        socket.on("connect_error", error => {
            const errorMessage = error.toString();
            if (namespace && errorMessage.includes(VALID_AUTH_ERROR)) {
                console.log(`✅ ${namespace || 'default'} (${token ? 'auth' : 'unauth'}) - expected error:`, errorMessage);
            } else {
                console.error(`🔴 ${namespace || 'default'} (${token ? 'auth' : 'unauth'}) - unexpected error:`, errorMessage);
            }
            socket.disconnect();
        });

        // ping test
        socket.on("connect", () => {
            socket.emit("ping");
            socket.on("ping-response", response => {
                if (response !== VALID_PING_RESPONSE) {
                    console.error(`🔴 ${namespace || 'default'} (${token ? 'auth' : 'unauth'}) - unexpected response:`, response);
                } else {
                    console.log(`✅ ${namespace || 'default'} (${token ? 'auth' : 'unauth'}) - received response:`, response);
                }
                socket.disconnect();
            });
        });
    }
    catch (error) {
        console.error(`🔴 ${namespace || 'default'} (${token ? 'auth' : 'unauth'}) - unexpected error:`, error.toString());
        process.exit(1);
    }
}

// test connections to all namespaces
NAMESPACES.forEach((namespace, index) => {
    setTimeout(() => {
        console.log(`⏳ testing namespace: ${namespace || 'default'}`);
        test_connection(namespace);
        test_connection(namespace, VALID_TOKEN);
    }, index * 1000);
});
