const jwt = require('jsonwebtoken');

// verify jwt token sent with connection request
const verifyToken = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return next(new Error('Authentication error'));
        }
        // attach username to socket
        socket.username = decoded.username;
        next();
    });
}

module.exports = {
    verifyToken,
};