const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    productName: {
        type: String,
    },
    productPrice: {
        type: Number,
        default: 0,
    },
    discountRate: {
        type: Number,
        default: 0,
    },
    shippingCharge: {
        type: Number,
        default: 0,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    photo: {
        type: String,
    },
    active: {
        type: Boolean,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

let productModel;

try {
    productModel = mongoose.model('products');
} catch (error) {
    productModel = mongoose.model('products', productSchema);
}

module.exports = productModel;
