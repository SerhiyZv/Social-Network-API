const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: "You need to provide a username!",
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Type.ObjectId,
                ref: "User",
            }
        ],
        toJSON: {
            virtuals: true
        },
        id: false,
    }
)

UserSchema.virtual("friendCount").get(function () {
    return this.friends.length;
})

const User = model("User", UserSchema);

module.exports = User;