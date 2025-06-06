const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const followSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

followSchema.plugin(mongoosePaginate);

module.exports = model("Follow", followSchema, "follows")