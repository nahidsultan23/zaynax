const express = require('express');
const router = express.Router();

const productModel = require('../../models/productModel');
const orderModel = require('../../models/orderModel');

const validator = require('../../helper/validationHelper');
const services = require('../../helper/services');

router.post('/place-order', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            promoCode: '',
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let cartItems = req.body.cartItems;
        let promoCode = req.body.promoCode;
        let stringProductIds = [];

        if (promoCode) {
            promoCode = promoCode.toString();
            promoCode = services.removeSpacesFromString(promoCode);

            if (promoCode.length) {
                promoCode = services.allUpperCases(promoCode);
            } else {
                resData.errorMessages.error = 'Invalid Promo Code';
                errorOccurred = true;
            }
        } else {
            promoCode = '';
        }

        if (Array.isArray(cartItems)) {
            if (cartItems.length) {
                let cartItemsModified = [];

                for (let i = 0; i < cartItems.length; i++) {
                    if (cartItems[i].productId && cartItems[i].quantity) {
                        let productId = cartItems[i].productId.toString();
                        let quantity = Number(cartItems[i].quantity);

                        if (productId && quantity && Number.isInteger(quantity) && quantity > 0) {
                            stringProductIds.push(productId);

                            cartItemsModified.push({
                                productId: productId,
                                quantity: quantity,
                            });
                        } else {
                            resData.errorMessages.error = 'Invalid request';
                            errorOccurred = true;
                            break;
                        }
                    } else {
                        resData.errorMessages.error = 'Invalid request';
                        errorOccurred = true;
                        break;
                    }
                }

                if (!errorOccurred) {
                    productModel.find({ _id: { $in: stringProductIds }, active: true }, (err, products) => {
                        if (err) {
                            resData.errorMessages.error = 'Something went wrong';
                            errorOccurred = true;
                        } else if (products.length !== stringProductIds.length) {
                            resData.errorMessages.error = 'All products are not available';
                            errorOccurred = true;
                        } else {
                            let totalPrice = 0;
                            let totalShippingCharge = 0;

                            products.forEach((product) => {
                                let productUnitPrice = product.productPrice;
                                let productDiscountedPrice = productUnitPrice - productUnitPrice * (product.discountRate / 100);
                                let index = cartItemsModified.findIndex((a) => a.productId === product.id.toString());
                                let quantity = cartItemsModified[index].quantity;
                                let productFinalPrice = productDiscountedPrice * quantity;

                                totalPrice += productFinalPrice;
                                totalShippingCharge += product.shippingCharge;
                            });

                            validator.applyPromoCodeIfAvailable(promoCode, totalPrice, (result) => {
                                if (result.okay) {
                                    let priceAfterDiscount = result.newPrice;
                                    let cartTotalPrice = priceAfterDiscount + totalShippingCharge;

                                    cartTotalPrice = services.upToTwoDecimal(cartTotalPrice);

                                    new orderModel({
                                        itemPrice: cartTotalPrice,
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
                                } else {
                                    resData.errorMessages.promoCode = result.message;
                                    resData.errorMessages.error = result.error;

                                    return res.json(resData);
                                }
                            });
                        }

                        if (errorOccurred) {
                            return res.json(resData);
                        }
                    });
                }
            } else {
                resData.errorMessages.error = 'Invalid request';
                errorOccurred = true;
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
