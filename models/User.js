const Thought = require('./Thought');
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
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
            ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {    
        toJSON: {
            virtuals: true
        },
        id: false,
    }
)

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// BONUS
// userSchema.pre("findOneAndDelete", { document: false, query: true }, async function() {
//     console.log("User pre-delete");
//     const doc = await this.model.findOne(this.getFilter());
//     console.log(doc.username);
//     await Thought.deleteMany({ username: doc.username });
// });

const User = model('User', userSchema);

module.exports = User;