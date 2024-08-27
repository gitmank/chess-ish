const { Schema, model, models } = require('mongoose');

const gameSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    moves: {
        type: Array,
        required: true,
        default: [],
    },
    players: {
        type: Array,
        required: true,
        default: []
    },
    winner: {
        type: String,
        default: "",
    },
    currentTurn: {
        type: String,
        required: true,
    },
    startedAt: {
        type: String,
        default: new Date().toISOString(),
    },
    endedAt: {
        type: String,
        default: "",
    },
})
const Game = models.Game || model("Game", gameSchema, 'games');

module.exports = Game;