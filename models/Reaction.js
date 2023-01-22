const { Schema, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: 'Please enter your reaction',
            maxLength: 280
        },
        username: {
            type: String,
            required:  'Please enter your username!'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal),
        }
    }
);

module.exports = ReactionSchema;