const mongoose = require('mongoose');
const schema = mongoose.Schema;

const promotionSchema = new schema({
    promoCode: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    discountRate: {
        type: Number,
    },
    useTime: {
        type: Number,
    },
    usages: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

let promotionModel;

try {
    promotionModel = mongoose.model('promotions');
} catch (error) {
    promotionModel = mongoose.model('promotions', promotionSchema);
}

module.exports = promotionModel;
