const express = require('express');
const router = express.Router();

const validator = require('../../helper/validationHelper');

router.post('/check-validity', (req, res) => {
    let resData = {
        success: false,
        discountRate: '',
        errorMessages: {
            promoCode: '',
            error: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let promoCode = req.body.promoCode;

        if (promoCode) {
            validator.isValidPromoCode(promoCode, (result) => {
                if (result.okay) {
                    resData.success = true;
                    resData.discountRate = result.discountRate;
                } else {
                    resData.errorMessages.error = result.error;
                    resData.errorMessages.promoCode = result.message;
                }

                return res.json(resData);
            });
        } else {
            resData.errorMessages.promoCode = 'Invalid Promo Code';
            errorOccurred = true;
        }
    } else {
        resData.errorMessages.promoCode = 'Invalid Promo Code';
        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.json(resData);
    }
});

module.exports = router;
