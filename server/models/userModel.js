const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

let userModel;

try {
    userModel = mongoose.model('users');
} catch (error) {
    userModel = mongoose.model('users', userSchema);
}

module.exports = userModel;
