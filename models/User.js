const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

// To be used by Passport to manage the google signins
module.exports = mongoose.model('User', UserSchema)
