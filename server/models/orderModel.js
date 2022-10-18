const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
    itemPrice: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

let orderModel;

try {
    orderModel = mongoose.model('orders');
} catch (error) {
    orderModel = mongoose.model('orders', orderSchema);
}

module.exports = orderModel;
