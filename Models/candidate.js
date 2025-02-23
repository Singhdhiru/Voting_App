const { name } = require('body-parser');
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            user: {
                //* Id of the user who has voyed
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
})
const candidate = mongoose.model('candodate', userSchema);
module.exports = candidate;