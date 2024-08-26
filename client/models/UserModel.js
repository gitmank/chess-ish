import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    created: {
        type: String,
        default: new Date().toISOString(),
    },
});
const User = models.User || model("User", userSchema, 'users');

export default User;