const mongoose = require('mongoose');
const schema = mongoose.Schema;

const photoSequenceSchema = new schema({
    sequence: {
        type: Number,
        default: 0,
    },
});

let photoSequenceModel;

try {
    photoSequenceModel = mongoose.model('photoSequence');
} catch (error) {
    photoSequenceModel = mongoose.model('photoSequence', photoSequenceSchema);
}

module.exports = photoSequenceModel;
