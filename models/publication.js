const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const publicationSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    file: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

publicationSchema.plugin(mongoosePaginate);

module.exports = model("Publication", publicationSchema, "publications");