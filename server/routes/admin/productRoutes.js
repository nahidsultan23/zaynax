const express = require('express');
const router = express.Router();

const productModel = require('../../models/productModel');

const validator = require('../../helper/validationHelper');
const services = require('../../helper/services');
const uploadPhoto = require('../../helper/uploadPhoto');

router.post('/add-new', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            photo: '',
            productName: '',
            productPrice: '',
            discountRate: '',
            shippingCharge: '',
            color: '',
            size: '',
            error: '',
        },
    };

    let errorOccurred = false;

    uploadPhoto(req, res, (err, fileName) => {
        if (err) {
            resData.errorMessages.photo = err;
            errorOccurred = true;
        }

        if (req.body) {
            let productName = req.body.productName;
            let productPrice = req.body.productPrice;
            let discountRateSentByClient = req.body.discountRate;
            let shippingCharge = req.body.shippingCharge;
            let color = req.body.color;
            let size = req.body.size;
            let active = req.body.active && req.body.active === 'true' ? true : false;

            if (!errorOccurred && productName && (productPrice === 0 || productPrice) && (shippingCharge === 0 || shippingCharge) && color && size) {
                productName = productName.toString();
                productPrice = Number(productPrice);
                discountRate = discountRateSentByClient ? Number(discountRateSentByClient) : 0;
                shippingCharge = Number(shippingCharge);
                color = color.toString();
                size = size.toString();

                if (!validator.validateString(productName)) {
                    resData.errorMessages.productName = 'Product Name is required';
                    errorOccurred = true;
                }

                if (!validator.isNonNegative(productPrice)) {
                    resData.errorMessages.productPrice = 'A valid Product Price is required';
                    errorOccurred = true;
                }

                if (discountRateSentByClient && !validator.isNonNegative(discountRate)) {
                    resData.errorMessages.discountRate = 'A valid Discount Rate is required';
                    errorOccurred = true;
                }

                if (!validator.isNonNegative(shippingCharge)) {
                    resData.errorMessages.shippingCharge = 'A valid Shipping Charge is required';
                    errorOccurred = true;
                }

                if (!validator.validateString(color)) {
                    resData.errorMessages.color = 'Color is required';
                    errorOccurred = true;
                }

                if (!validator.validateString(size)) {
                    resData.errorMessages.size = 'Size is required';
                    errorOccurred = true;
                }

                if (!errorOccurred) {
                    new productModel({
                        productName: productName,
                        productPrice: productPrice,
                        discountRate: discountRate,
                        shippingCharge: shippingCharge,
                        color: color,
                        size: size,
                        active: active,
                        photo: fileName,
                    })
                        .save()
                        .then(() => {
                            resData.success = true;
                            return res.json(resData);
                        })
                        .catch((err) => {
                            resData.errorMessages.error = 'Something went wrong';
                            return res.json(resData);
                        });
                }
            } else {
                if (!productName) {
                    resData.errorMessages.productName = 'Product Name is required';
                }

                if (!productPrice && productPrice !== 0) {
                    resData.errorMessages.productPrice = 'Product Price is required';
                }

                if (!discountRateSentByClient && discountRateSentByClient !== 0) {
                    resData.errorMessages.discountRate = 'Discount Rate is required';
                }

                if (!shippingCharge && shippingCharge !== 0) {
                    resData.errorMessages.shippingCharge = 'Shipping Charge is required';
                }

                if (!color) {
                    resData.errorMessages.color = 'Color is required';
                }

                if (!size) {
                    resData.errorMessages.size = 'Size is required';
                }

                errorOccurred = true;
            }
        } else {
            resData.errorMessages.productName = 'Product Name is required';
            resData.errorMessages.productPrice = 'Product Price is required';
            resData.errorMessages.discountRate = 'Discount Rate is required';
            resData.errorMessages.shippingCharge = 'Shipping Charge is required';
            resData.errorMessages.color = 'Color is required';
            resData.errorMessages.size = 'Size is required';

            errorOccurred = true;
        }

        if (errorOccurred) {
            return res.json(resData);
        }
    });
});

router.get('/fetch-all', (req, res) => {
    let resData = {
        success: false,
        products: [],
        errorMessages: {
            error: '',
        },
    };

    productModel.find({}, (err, products) => {
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

module.exports = router;
