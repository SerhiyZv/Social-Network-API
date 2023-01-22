const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");
const reactionSchema = require("./Reaction");

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: "Your thought must be between 1 and 280 characters!",
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createAtVal) => dateFormat(createAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [{
            type: reactionSchema,
        }]
    }
)

ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

model.exports = Thought;