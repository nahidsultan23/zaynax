const mongoose = require('mongoose');

const dbHost = 'localhost:27017';
const dbName = 'testProject';
const dbUri = 'mongodb://' + dbHost + '/' + dbName + '?retryWrites=true&w=majority';

const connect = () => {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage().then(() => {
                mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then((res, err) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
            });
        } else {
            mongoose
                .connect(dbUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                .then((res, err) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
        }
    });
};

const disconnect = () => {
    return mongoose.disconnect();
};

module.exports = { connect, disconnect };
