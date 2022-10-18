const bcrypt = require('bcryptjs');

const saltRounds = 10;

const encryptPassword = (password, cb) => {
    bcrypt.hash(password, saltRounds).then((encryptedPassword) => {
        cb(encryptedPassword);
    });
};

module.exports = encryptPassword;
