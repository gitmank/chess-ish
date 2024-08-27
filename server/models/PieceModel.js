const { Schema, model, models } = require('mongoose');

const pieceSchema = new Schema({
    game: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    location: {
        type: Array,
        required: true,
    },
    taken: {
        type: Boolean,
        default: false,
    },

})
const Piece = models.Piece || model("Piece", pieceSchema, 'pieces');

module.exports = Piece;