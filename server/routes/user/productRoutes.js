const express = require('express');
const router = express.Router();

const productModel = require('../../models/productModel');

const services = require('../../helper/services');

router.get('/fetch-all', (req, res) => {
    let resData = {
        success: false,
        products: [],
        errorMessages: {
            error: '',
        },
    };

    productModel.find({ active: true }, (err, products) => {
        if (err) {
            resData.errorMessages.error = 'Something went wrong';
        } else {
            resData.success = true;

            if (products.length) {
                products.forEach((product) => {
                    let showablePrice = services.upToTwoDecimal(product.productPrice - product.productPrice * (product.discountRate / 100));

                    resData.products.push({
                        productId: product.id,
                        productName: product.productName,
                        productPrice: product.productPrice,
                        discountRate: product.discountRate,
                        showablePrice: showablePrice,
                        photo: product.photo,
                    });
                });
            }
        }

        return res.json(resData);
    });
});

router.post('/fetch-products', (req, res) => {
    let resData = {
        success: false,
        products: [],
        errorMessages: {
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let productIds = req.body.productIds;
        let stringProductIds = [];

        if (Array.isArray(productIds)) {
            if (productIds.length) {
                productIds.forEach((productId) => {
                    stringProductIds.push(productId.toString());
                });

                productModel.find({ _id: { $in: stringProductIds }, active: true }, (err, products) => {
                    if (err) {
                        resData.errorMessages.error = 'Something went wrong';
                    } else if (products.length !== stringProductIds.length) {
                        resData.errorMessages.error = 'All products are not available';
                    } else {
                        resData.success = true;

                        products.forEach((product) => {
                            let showablePrice = services.upToTwoDecimal(product.productPrice - product.productPrice * (product.discountRate / 100));

                            resData.products.push({
                                productId: product.id,
                                productName: product.productName,
                                productPrice: product.productPrice,
                                discountRate: product.discountRate,
                                showablePrice: showablePrice,
                                shippingCharge: product.shippingCharge,
                                color: product.color,
                                size: product.size,
                                photo: product.photo,
                            });
                        });
                    }

                    return res.json(resData);
                });
            } else {
                resData.success = true;
                return res.json(resData);
            }
        } else {
            resData.errorMessages.error = 'Invalid request';
            errorOccurred = true;
        }
    } else {
        resData.errorMessages.error = 'Invalid request';
        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.json(resData);
    }
});

module.exports = router;
