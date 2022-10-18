const moment = require('moment');
const bcrypt = require('bcryptjs');

const promotionModel = require('../models/promotionModel');

const services = require('./services');

const validatePromoCode = (promoCode) => {
    let validationResult = true;

    if (!promoCode) {
        validationResult = false;
    }

    return validationResult;
};

const isValidDate = (date) => {
    let validationResult = false;

    let splittedDate = date.split('-');

    if (splittedDate.length === 3 && splittedDate[0].length === 4 && splittedDate[1].length <= 2 && splittedDate[2].length <= 2) {
        let reAssembledDate = splittedDate[0] + '-' + splittedDate[1] + '-' + splittedDate[2];

        let m = moment(reAssembledDate, 'YYYY-MM-DD');

        if (m.isValid()) {
            validationResult = true;
        }
    }

    return validationResult;
};

const isPastDate = (date) => {
    let validationResult = true;

    let currentUtcDate = new Date();
    let currentUtcTimestamp = currentUtcDate.getTime();
    let currentUtcHours = currentUtcDate.getUTCHours();
    let currentUtcMinutes = currentUtcDate.getUTCMinutes();
    let currentUtcSeconds = currentUtcDate.getUTCSeconds();
    let currentUtcMilliseconds = currentUtcDate.getUTCMilliseconds();
    let utcTimestampAtDayStart =
        currentUtcTimestamp - (currentUtcHours * 3600 + currentUtcMinutes * 60 + currentUtcSeconds) * 1000 - currentUtcMilliseconds;
    let timestampAtBdDayStart = utcTimestampAtDayStart + 6 * 3600 * 1000;

    let providedDate = date + 'T12:00Z';
    let providedDateUtcTimestamp = new Date(providedDate).getTime();
    let providedDateBdTimestamp = providedDateUtcTimestamp + 6 * 3600 * 1000;

    if (providedDateBdTimestamp >= timestampAtBdDayStart) {
        validationResult = false;
    }

    return validationResult;
};

const isFutureDate = (date) => {
    let validationResult = false;

    let currentUtcDate = new Date();
    let currentUtcTimestamp = currentUtcDate.getTime();
    let currentUtcHours = currentUtcDate.getUTCHours();
    let currentUtcMinutes = currentUtcDate.getUTCMinutes();
    let currentUtcSeconds = currentUtcDate.getUTCSeconds();
    let currentUtcMilliseconds = currentUtcDate.getUTCMilliseconds();
    let utcTimestampAtDayStart =
        currentUtcTimestamp - (currentUtcHours * 3600 + currentUtcMinutes * 60 + currentUtcSeconds) * 1000 - currentUtcMilliseconds;
    let timestampAtBdDayStart = utcTimestampAtDayStart + 6 * 3600 * 1000;
    let timeStampAtTomorrowBdDayStart = timestampAtBdDayStart + 24 * 3600 * 1000;

    let providedDate = date + 'T12:00Z';
    let providedDateUtcTimestamp = new Date(providedDate).getTime();
    let providedDateBdTimestamp = providedDateUtcTimestamp + 6 * 3600 * 1000;

    if (providedDateBdTimestamp >= timeStampAtTomorrowBdDayStart) {
        validationResult = true;
    }

    return validationResult;
};

const isValidTimeRange = (date1, date2) => {
    let validationResult = false;

    let date1Timestamp = new Date(date1).getTime();
    let date2Timestamp = new Date(date2).getTime();

    if (date2Timestamp >= date1Timestamp) {
        validationResult = true;
    }

    return validationResult;
};

const validateString = (string) => {
    let validationResult = false;

    let newString = services.removeSpacesFromString(string);

    if (newString.length) {
        validationResult = true;
    }

    return validationResult;
};

const isNonNegative = (number) => {
    let validationResult = false;

    if (number === 0) {
        validationResult = true;
    } else if (number && number > 0) {
        validationResult = true;
    }

    return validationResult;
};

const validatePhoto = (photo, cb) => {
    let validationResult = false;

    if (
        photo.mimetype === 'image/gif' ||
        photo.mimetype === 'image/jpeg' ||
        photo.mimetype === 'image/pjpeg' ||
        photo.mimetype === 'image/x-png' ||
        photo.mimetype === 'image/png' ||
        photo.mimetype === 'image/svg+xml' ||
        photo.mimetype === 'image/webp'
    ) {
        validationResult = true;
    }

    cb(validationResult);
};

const validatePhoneNumber = (phoneNumber) => {
    let validationResult = false;

    let newPhoneNumber = services.removeSpacesFromString(phoneNumber);

    if (newPhoneNumber.length === 11) {
        let newPhoneNumberInNumber = Number(newPhoneNumber);

        if (newPhoneNumberInNumber) {
            if (newPhoneNumberInNumber >= 1300000000 && newPhoneNumberInNumber <= 1999999999) {
                validationResult = true;
            }
        }
    }

    return validationResult;
};

const isValidPromoCode = (promoCode, cb) => {
    let validationResult = {
        okay: false,
        message: '',
        error: '',
        discountRate: '',
        promotion: '',
    };

    let validationErrorOccurred = false;

    let newPromoCode = promoCode.toString();

    if (!validateString(newPromoCode)) {
        validationResult.message = 'A valid Promo Code is required';
        validationErrorOccurred = true;
    }

    newPromoCode = services.allUpperCases(newPromoCode);

    if (!validationErrorOccurred) {
        promotionModel.findOne({ promoCode: newPromoCode }, (err, promotion) => {
            if (err) {
                validationResult.error = 'Something went wrong';
            } else {
                if (promotion) {
                    let active = promotion.active;
                    let useTime = promotion.useTime;
                    let startDate = promotion.startDate;
                    let endDate = promotion.endDate;

                    if (isFutureDate(startDate)) {
                        validationResult.message = 'Invalid Promo Code';
                    } else {
                        if (active && useTime && !isPastDate(endDate)) {
                            validationResult.okay = true;
                            validationResult.discountRate = promotion.discountRate;
                            validationResult.promotion = promotion;
                        } else {
                            validationResult.message = 'Promo Code has expired';
                        }
                    }
                } else {
                    validationResult.message = 'Invalid Promo Code';
                }
            }

            cb(validationResult);
        });
    } else {
        cb(validationResult);
    }
};

const applyPromoCodeIfAvailable = (promoCode, totalPrice, cb) => {
    let validationResult = {
        okay: false,
        message: '',
        error: '',
        newPrice: totalPrice,
    };

    if (promoCode) {
        isValidPromoCode(promoCode, (result) => {
            if (result.okay) {
                let discountRate = result.discountRate;

                validationResult.okay = true;
                validationResult.newPrice = totalPrice - totalPrice * (discountRate / 100);

                result.promotion.useTime--;
                result.promotion.usages++;

                result.promotion
                    .save()
                    .then(() => {
                        cb(validationResult);
                    })
                    .catch((err) => {
                        validationResult.okay = false;
                        validationResult.error = 'Something went wrong';

                        cb(validationResult);
                    });
            } else {
                validationResult.error = result.error;
                validationResult.message = result.message;

                cb(validationResult);
            }
        });
    } else {
        validationResult.okay = true;
        cb(validationResult);
    }
};

const comparePasswords = (password, passwordFromDb, cb) => {
    bcrypt.compare(password, passwordFromDb).then((result) => {
        cb(result);
    });
};

module.exports = {
    validatePromoCode: validatePromoCode,
    isValidDate: isValidDate,
    isPastDate: isPastDate,
    isFutureDate: isFutureDate,
    isValidTimeRange: isValidTimeRange,
    validateString: validateString,
    isNonNegative: isNonNegative,
    validatePhoto: validatePhoto,
    validatePhoneNumber: validatePhoneNumber,
    isValidPromoCode: isValidPromoCode,
    applyPromoCodeIfAvailable: applyPromoCodeIfAvailable,
    comparePasswords: comparePasswords,
};
