const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-ish-db');
        console.log('connected to MongoDB');
    } catch (error) {
        console.log('error connecting to database:', error.toString());
    }
}

module.exports = connectToMongo;