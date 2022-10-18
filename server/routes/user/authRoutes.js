const express = require('express');
const router = express.Router();

const userModel = require('../../models/userModel');

const validator = require('../../helper/validationHelper');
const encryptPassword = require('../../helper/encryptPassword');

router.post('/register', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            phoneNumber: '',
            password: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;

        if (phoneNumber && password) {
            phoneNumber = phoneNumber.toString();
            password = password.toString();

            if (!validator.validatePhoneNumber(phoneNumber)) {
                resData.errorMessages.phoneNumber = 'A valid Phone Number is required';
                errorOccurred = true;
            }

            if (!validator.validateString(password)) {
                resData.errorMessages.password = 'A valid Password is required';
                errorOccurred = true;
            }

            if (!errorOccurred) {
                userModel.findOne({ phoneNumber: phoneNumber }, (err, user) => {
                    if (err) {
                        resData.errorMessages.error = 'Something went wrong';
                        errorOccurred = true;
                    } else {
                        if (user) {
                            resData.errorMessages.phoneNumber = 'Phone number is already attached to an existing account';
                            errorOccurred = true;
                        } else {
                            encryptPassword(password, (encryptedPassword) => {
                                new userModel({
                                    phoneNumber: phoneNumber,
                                    password: encryptedPassword,
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
                            });
                        }
                    }

                    if (errorOccurred) {
                        return res.json(resData);
                    }
                });
            }
        } else {
            if (!phoneNumber) {
                resData.errorMessages.phoneNumber = 'Phone Number is required';
            }

            if (!password) {
                resData.errorMessages.password = 'Password is required';
            }

            errorOccurred = true;
        }
    } else {
        resData.errorMessages.phoneNumber = 'Phone Number is required';
        resData.errorMessages.password = 'Password is required';

        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.json(resData);
    }
});

router.post('/login', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            phoneNumber: '',
            password: '',
        },
    };

    let errorOccurred = false;

    if (req.body) {
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;

        if (phoneNumber && password) {
            phoneNumber = phoneNumber.toString();
            password = password.toString();

            if (!validator.validatePhoneNumber(phoneNumber)) {
                resData.errorMessages.phoneNumber = 'A valid Phone Number is required';
                errorOccurred = true;
            }

            if (!validator.validateString(password)) {
                resData.errorMessages.password = 'Wrong Password';
                errorOccurred = true;
            }

            if (!errorOccurred) {
                userModel.findOne({ phoneNumber: phoneNumber }, (err, user) => {
                    if (err) {
                        resData.errorMessages.error = 'Something went wrong';
                        errorOccurred = true;
                    } else {
                        if (user) {
                            validator.comparePasswords(password, user.password, (result) => {
                                if (result) {
                                    resData.success = true;
                                } else {
                                    resData.errorMessages.password = 'Wrong Password';
                                }

                                return res.json(resData);
                            });
                        } else {
                            resData.errorMessages.phoneNumber = 'Phone number is not attached to any account';
                            errorOccurred = true;
                        }
                    }

                    if (errorOccurred) {
                        return res.json(resData);
                    }
                });
            }
        } else {
            if (!phoneNumber) {
                resData.errorMessages.phoneNumber = 'Phone Number is required';
            }

            if (!password) {
                resData.errorMessages.password = 'Password is required';
            }

            errorOccurred = true;
        }
    } else {
        resData.errorMessages.phoneNumber = 'Phone Number is required';
        resData.errorMessages.password = 'Password is required';

        errorOccurred = true;
    }

    if (errorOccurred) {
        return res.json(resData);
    }
});

module.exports = router;
