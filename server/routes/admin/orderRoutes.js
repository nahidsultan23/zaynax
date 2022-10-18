const express = require('express');
const router = express.Router();

const orderModel = require('../../models/orderModel');

const validator = require('../../helper/validationHelper');
const services = require('../../helper/services');

router.get('/fetch-all', (req, res) => {
    let resData = {
        success: false,
        orders: [],
        errorMessages: {
            error: '',
        },
    };

    orderModel.find({}, (err, orders) => {
        if (err) {
            resData.errorMessages.error = 'Something went wrong';
        } else {
            resData.success = true;

            if (orders.length) {
                orders.forEach((order) => {
                    resData.orders.push({
                        orderId: order.id,
                        itemPrice: order.itemPrice,
                        status: order.status,
                    });
                });
            }
        }

        return res.json(resData);
    });
});

router.post('/change-status', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let orderId = req.body.orderId;
        let status = req.body.status;

        if (orderId && (status === 'Confirmed' || status === 'Cancelled')) {
            orderId = orderId.toString();
            orderId = services.removeSpacesFromString(orderId);

            if (validator.validateString(orderId)) {
                orderModel.findOne({ _id: orderId }, (err, order) => {
                    if (err) {
                        resData.errorMessages.error = 'Something went wrong';
                        errorOccurred = true;
                    } else {
                        if (order) {
                            let orderStatus = order.status;

                            if (orderStatus === 'Pending') {
                                order.status = status;

                                order
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
                                resData.errorMessages.error = 'The Status of the Order No ' + order.id.toString() + ' was not changed';
                                errorOccurred = true;
                            }
                        } else {
                            resData.errorMessages.error = 'Invalid request';
                            errorOccurred = true;
                        }
                    }

                    if (errorOccurred) {
                        return res.json(resData);
                    }
                });
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
