const { Schema, model } = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    surname: {
        type: String, 
        required: true
    },
    nick: {
        type: String, 
        required: true, 
        unique: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    role: {
        type: String, 
        default: "role_user"
    },
    image: {
        type: String,
        default: "default.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("User", userSchema, "users");