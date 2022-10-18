const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    let resData = {
        success: false,
        errorMessages: {
            userId: '',
            password: '',
        },
    };

    if (req.body) {
        let userId = req.body.userId;
        let password = req.body.password;

        if (userId && password) {
            if (userId === 'Test_User2021' && password === 'Easy_123') {
                resData.success = true;
            } else {
                if (userId !== 'Test_User2021') {
                    resData.errorMessages.userId = 'Invalid User ID';
                } else {
                    resData.errorMessages.password = 'Wrong Password';
                }
            }
        } else {
            if (!userId) {
                resData.errorMessages.userId = 'User ID is required';
            }

            if (!password) {
                resData.errorMessages.password = 'Password is required';
            }
        }
    } else {
        resData.errorMessages.userId = 'User ID is required';
        resData.errorMessages.password = 'Password is required';
    }

    return res.json(resData);
});

module.exports = router;
