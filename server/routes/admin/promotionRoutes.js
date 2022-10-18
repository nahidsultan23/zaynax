const express = require('express');
const router = express.Router();

const promotionModel = require('../../models/promotionModel');

const services = require('../../helper/services');
const validator = require('../../helper/validationHelper');

router.post('/add-new', (req, res) => {
    let resData = {
        success: false,
        promoCode: '',
        discountRate: '',
        errorMessages: {
            promoCode: '',
            startDate: '',
            endDate: '',
            discountRate: '',
            useTime: '',
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let promoCode = req.body.promoCode;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let discountRate = req.body.discountRate;
        let useTime = req.body.useTime;
        let active = req.body.active && req.body.active === true ? true : false;

        if (promoCode && startDate && endDate && (discountRate === 0 || discountRate) && (useTime === 0 || useTime)) {
            promoCode = promoCode.toString();
            startDate = startDate.toString();
            endDate = endDate.toString();
            discountRate = Number(discountRate);
            useTime = Number(useTime);

            promoCode = services.removeSpacesFromString(promoCode);

            if (validator.validatePromoCode(promoCode)) {
                promoCode = services.allUpperCases(promoCode);
            } else {
                resData.errorMessages.promoCode = 'A valid Promo Code is required';
                errorOccurred = true;
            }

            if (!validator.isValidDate(startDate)) {
                resData.errorMessages.startDate = 'A valid date is required';
                errorOccurred = true;
            } else if (validator.isPastDate(startDate)) {
                resData.errorMessages.startDate = 'A past date is not acceptable';
                errorOccurred = true;
            }

            if (!validator.isValidDate(endDate)) {
                resData.errorMessages.endDate = 'A valid date is required';
                errorOccurred = true;
            } else if (validator.isPastDate(endDate)) {
                resData.errorMessages.endDate = 'A past date is not acceptable';
                errorOccurred = true;
            }

            if (!(resData.errorMessages.endDate || resData.errorMessages.startDate) && !validator.isValidTimeRange(startDate, endDate)) {
                resData.errorMessages.endDate = 'End Date cannot be before the Start Date';
                errorOccurred = true;
            }

            if (discountRate !== 0) {
                if (!discountRate) {
                    resData.errorMessages.discountRate = 'A valid Discount Rate is required';
                    errorOccurred = true;
                } else if (discountRate < 0 || discountRate > 100) {
                    resData.errorMessages.discountRate = 'A valid Discount Rate is required';
                    errorOccurred = true;
                }
            }

            if (!(Number.isInteger(useTime) && validator.isNonNegative(useTime))) {
                resData.errorMessages.useTime = 'A valid Use Time is required';
                errorOccurred = true;
            }

            if (!errorOccurred) {
                promotionModel.findOne({ promoCode: promoCode }, (err, promotion) => {
                    if (err) {
                        resData.errorMessages.error = 'Something went wrong';
                        errorOccurred = true;
                    } else if (promotion) {
                        resData.errorMessages.promoCode = 'Promo Code already exists';
                        errorOccurred = true;
                    } else {
                        startDate = services.twoCharactersMonthAndDate(startDate);
                        endDate = services.twoCharactersMonthAndDate(endDate);

                        discountRate = services.upToTwoDecimal(discountRate);

                        new promotionModel({
                            promoCode: promoCode,
                            startDate: startDate,
                            endDate: endDate,
                            discountRate: discountRate,
                            useTime: useTime,
                            active: active,
                        })
                            .save()
                            .then(() => {
                                resData.success = true;
                                resData.promoCode = promoCode;
                                resData.discountRate = discountRate;

                                return res.json(resData);
                            })
                            .catch((err) => {
                                resData.errorMessages.error = 'Something went wrong';
                                return res.json(resData);
                            });
                    }

                    if (errorOccurred) {
                        return res.json(resData);
                    }
                });
            }
        } else {
            if (!promoCode) {
                resData.errorMessages.promoCode = 'Promo Code is required';
            }

            if (!startDate) {
                resData.errorMessages.startDate = 'Start Date is required';
            }

            if (!endDate) {
                resData.errorMessages.endDate = 'End Date is required';
            }

            if (!discountRate) {
                resData.errorMessages.discountRate = 'Discount Rate is required';
            }

            if (!useTime) {
                resData.errorMessages.useTime = 'Use Time is required';
            }

            errorOccurred = true;
        }
    } else {
        resData.errorMessages.userId = 'User ID is required';
        resData.errorMessages.password = 'Password is required';

        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.json(resData);
    }
});

router.post('/update', (req, res) => {
    let resData = {
        success: false,
        discountRate: '',
        errorMessages: {
            endDate: '',
            discountRate: '',
            useTime: '',
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let promoCodeId = req.body.promoCodeId;
        let endDate = req.body.endDate;
        let discountRate = req.body.discountRate;
        let useTime = req.body.useTime;
        let active = req.body.active && req.body.active === true ? true : false;

        if (promoCodeId && endDate && (discountRate === 0 || discountRate) && (useTime === 0 || useTime)) {
            promoCodeId = promoCodeId.toString();
            endDate = endDate.toString();
            discountRate = Number(discountRate);
            useTime = Number(useTime);

            if (!validator.isValidDate(endDate)) {
                resData.errorMessages.endDate = 'A valid date is required';
                errorOccurred = true;
            } else if (validator.isPastDate(endDate)) {
                resData.errorMessages.endDate = 'A past date is not acceptable';
                errorOccurred = true;
            }

            if (discountRate !== 0) {
                if (!discountRate) {
                    resData.errorMessages.discountRate = 'A valid Discount Rate is required';
                    errorOccurred = true;
                } else if (discountRate < 0 || discountRate > 100) {
                    resData.errorMessages.discountRate = 'A valid Discount Rate is required';
                    errorOccurred = true;
                }
            }

            if (!(Number.isInteger(useTime) && validator.isNonNegative(useTime))) {
                resData.errorMessages.useTime = 'A valid Use Time is required';
                errorOccurred = true;
            }

            if (!errorOccurred) {
                endDate = services.twoCharactersMonthAndDate(endDate);
                discountRate = services.upToTwoDecimal(discountRate);

                promotionModel.findOne({ _id: promoCodeId }, (err, promotion) => {
                    if (err || !promotion) {
                        resData.errorMessages.error = 'Something went wrong';
                        errorOccurred = true;
                    } else {
                        let startDate = promotion.startDate;

                        if (!validator.isValidTimeRange(startDate, endDate)) {
                            resData.errorMessages.endDate = 'End Date cannot be before the Start Date';
                            errorOccurred = true;
                        } else {
                            promotion.endDate = endDate;
                            promotion.discountRate = discountRate;
                            promotion.useTime = useTime;
                            promotion.active = active;

                            promotion
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
                    }

                    if (errorOccurred) {
                        return res.json(resData);
                    }
                });
            }
        } else {
            if (!promoCodeId) {
                resData.errorMessages.error = 'Invalid request';
            } else {
                if (!endDate) {
                    resData.errorMessages.endDate = 'End Date is required';
                }

                if (!discountRate) {
                    resData.errorMessages.discountRate = 'Discount Rate is required';
                }

                if (!useTime) {
                    resData.errorMessages.useTime = 'Use Time is required';
                }
            }

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

router.get('/fetch-all', (req, res) => {
    let resData = {
        success: false,
        promoCodes: [],
        errorMessages: {
            error: '',
        },
    };

    promotionModel.find({}, (err, promotions) => {
        if (err) {
            resData.errorMessages.error = 'Something went wrong';
        } else {
            resData.success = true;

            if (promotions.length) {
                promotions.forEach((promotion) => {
                    resData.promoCodes.push({
                        promoCodeId: promotion.id,
                        promoCode: promotion.promoCode,
                        startDate: promotion.startDate,
                        endDate: promotion.endDate,
                        useTime: promotion.useTime,
                        usages: promotion.usages,
                        discountRate: promotion.discountRate,
                        active: promotion.active,
                        createdOn: promotion.createdOn,
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
        let promoCodeId = req.body.promoCodeId;
        let active = req.body.active && req.body.active === true ? true : false;

        if (promoCodeId) {
            promoCodeId = promoCodeId.toString();

            promotionModel.findOne({ _id: promoCodeId }, (err, promotion) => {
                if (err || !promotion) {
                    resData.errorMessages.error = 'Something went wrong';
                    errorOccurred = true;
                } else {
                    promotion.active = active;

                    promotion
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

    if (errorOccurred) {
        return res.json(resData);
    }
});

module.exports = router;
