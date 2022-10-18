const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const db = require('../../db/db');
const app = require('../../app');

process.env.NODE_ENV = 'test';

const validator = require('../../helper/validationHelper');

describe('Check validatePromoCode() in validationHelper.js', () => {
    it('should return false if there is no promo code', () => {
        let result = validator.validatePromoCode('');

        expect(result).to.be.equal(false);
    });

    it('should return true if a promo code is provided', () => {
        let result = validator.validatePromoCode('A');

        expect(result).to.be.equal(true);
    });
});

describe('Check isValidDate() in validationHelper.js', () => {
    it('should return false if the date is not properly formatted', () => {
        let result = validator.isValidDate('21/03/2021');

        expect(result).to.be.equal(false);
    });

    it('should return false if the date does not have 3 parts', () => {
        let result = validator.isValidDate('21-03');

        expect(result).to.be.equal(false);
    });

    it('should return false if the date has 3 parts but they are not numbers', () => {
        let result = validator.isValidDate('A-B-C');

        expect(result).to.be.equal(false);
    });

    it('should return false if the date is not formatted in YYYY-MM-DD format', () => {
        let result = validator.isValidDate('01-31-2021');
        expect(result).to.be.equal(false);

        result = validator.isValidDate('31-01-2021');
        expect(result).to.be.equal(false);

        result = validator.isValidDate('21-01-21');
        expect(result).to.be.equal(false);
    });

    it('should return false if the date is formatted in YYYY-MM-DD format but is not a valid date', () => {
        let result = validator.isValidDate('2021-02-29');

        expect(result).to.be.equal(false);
    });

    it('should return true if the date is formatted in YYYY-MM-DD format and is a valid date', () => {
        let result = validator.isValidDate('2021-07-09');

        expect(result).to.be.equal(true);
    });
});

describe('Check isPastDate() in validationHelper.js', () => {
    let timestamp = new Date().getTime();
    let timestampBd = timestamp + 6 * 3600 * 1000;
    let dateBd = new Date(timestampBd);

    let todayDate =
        dateBd.getUTCFullYear().toString() +
        '-' +
        (dateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        dateBd.getUTCDate().toString().padStart(2, '0');

    let yesterdayTimestampBd = timestampBd - 24 * 3600 * 1000;
    let yesterdayDateBd = new Date(yesterdayTimestampBd);

    let yesterdayDate =
        yesterdayDateBd.getUTCFullYear().toString() +
        '-' +
        (yesterdayDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        yesterdayDateBd.getUTCDate().toString().padStart(2, '0');

    let tomorrowTimestampBd = timestampBd + 24 * 3600 * 1000;
    let tomorrowDateBd = new Date(tomorrowTimestampBd);

    let tomorrowDate =
        tomorrowDateBd.getUTCFullYear().toString() +
        '-' +
        (tomorrowDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        tomorrowDateBd.getUTCDate().toString().padStart(2, '0');

    it('should return true if the date is a previous date', () => {
        let result = validator.isPastDate(yesterdayDate);

        expect(result).to.be.equal(true);
    });

    it('should return false if the date is today', () => {
        let result = validator.isPastDate(todayDate);

        expect(result).to.be.equal(false);
    });

    it('should return false if the date is a future date', () => {
        let result = validator.isPastDate(tomorrowDate);

        expect(result).to.be.equal(false);
    });
});

describe('Check isFutureDate() in validationHelper.js', () => {
    let timestamp = new Date().getTime();
    let timestampBd = timestamp + 6 * 3600 * 1000;
    let dateBd = new Date(timestampBd);

    let todayDate =
        dateBd.getUTCFullYear().toString() +
        '-' +
        (dateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        dateBd.getUTCDate().toString().padStart(2, '0');

    let yesterdayTimestampBd = timestampBd - 24 * 3600 * 1000;
    let yesterdayDateBd = new Date(yesterdayTimestampBd);

    let yesterdayDate =
        yesterdayDateBd.getUTCFullYear().toString() +
        '-' +
        (yesterdayDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        yesterdayDateBd.getUTCDate().toString().padStart(2, '0');

    let tomorrowTimestampBd = timestampBd + 24 * 3600 * 1000;
    let tomorrowDateBd = new Date(tomorrowTimestampBd);

    let tomorrowDate =
        tomorrowDateBd.getUTCFullYear().toString() +
        '-' +
        (tomorrowDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        tomorrowDateBd.getUTCDate().toString().padStart(2, '0');

    it('should return false if the date is a previous date', () => {
        let result = validator.isFutureDate(yesterdayDate);

        expect(result).to.be.equal(false);
    });

    it('should return false if the date is today', () => {
        let result = validator.isFutureDate(todayDate);

        expect(result).to.be.equal(false);
    });

    it('should return true if the date is a future date', () => {
        let result = validator.isFutureDate(tomorrowDate);

        expect(result).to.be.equal(true);
    });
});

describe('Check isValidTimeRange() in validationHelper.js', () => {
    let timestamp = new Date().getTime();
    let timestampBd = timestamp + 6 * 3600 * 1000;
    let dateBd = new Date(timestampBd);

    let todayDate =
        dateBd.getUTCFullYear().toString() +
        '-' +
        (dateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        dateBd.getUTCDate().toString().padStart(2, '0');

    let yesterdayTimestampBd = timestampBd - 24 * 3600 * 1000;
    let yesterdayDateBd = new Date(yesterdayTimestampBd);

    let yesterdayDate =
        yesterdayDateBd.getUTCFullYear().toString() +
        '-' +
        (yesterdayDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        yesterdayDateBd.getUTCDate().toString().padStart(2, '0');

    let tomorrowTimestampBd = timestampBd + 24 * 3600 * 1000;
    let tomorrowDateBd = new Date(tomorrowTimestampBd);

    let tomorrowDate =
        tomorrowDateBd.getUTCFullYear().toString() +
        '-' +
        (tomorrowDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        tomorrowDateBd.getUTCDate().toString().padStart(2, '0');

    it('should return false if the second date is before the first date', () => {
        let result = validator.isValidTimeRange(todayDate, yesterdayDate);

        expect(result).to.be.equal(false);
    });

    it('should return true if both days are the same date', () => {
        let result = validator.isValidTimeRange(todayDate, todayDate);
        expect(result).to.be.equal(true);

        result = validator.isValidTimeRange(tomorrowDate, tomorrowDate);
        expect(result).to.be.equal(true);
    });

    it('should return true if the second date is ahead of the first date', () => {
        let result = validator.isValidTimeRange(todayDate, tomorrowDate);

        expect(result).to.be.equal(true);
    });
});

describe('Check validateString() in validationHelper.js', () => {
    it('should return false if the string is only spaces', () => {
        let result = validator.validateString(' ');

        expect(result).to.be.equal(false);
    });

    it('should return true if the string has at least one character except space', () => {
        let result = validator.validateString(' A');

        expect(result).to.be.equal(true);
    });
});

describe('Check isNonNegative() in validationHelper.js', () => {
    it('should return false if there is no value', () => {
        let result = validator.isNonNegative();

        expect(result).to.be.equal(false);
    });

    it('should return true if the number is 0', () => {
        let result = validator.isNonNegative(0);

        expect(result).to.be.equal(true);
    });

    it('should return true if the number is greater than 0', () => {
        let result = validator.isNonNegative(0.25);

        expect(result).to.be.equal(true);
    });

    it('should return false if the number is less than 0', () => {
        let result = validator.isNonNegative(-3);

        expect(result).to.be.equal(false);
    });
});

describe('Check validatePhoneNumber() in validationHelper.js', () => {
    it('should return false if the phone number is only spaces', () => {
        let result = validator.validatePhoneNumber('  ');

        expect(result).to.be.equal(false);
    });

    it('should return false if the all the characters in the phone number are not numbers', () => {
        let result = validator.validatePhoneNumber('019a9999999');

        expect(result).to.be.equal(false);
    });

    it('should return false if the phone number is not valid', () => {
        let result = validator.validatePhoneNumber('02888888888');

        expect(result).to.be.equal(false);
    });

    it('should return true if the phone number is valid', () => {
        let result = validator.validatePhoneNumber('01777777777');

        expect(result).to.be.equal(true);
    });
});

describe('Check isValidPromoCode() in validationHelper.js', () => {
    before((done) => {
        db.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        db.disconnect()
            .then(() => done())
            .catch((err) => done(err));
    });

    let timestamp = new Date().getTime();
    let timestampBd = timestamp + 6 * 3600 * 1000;
    let dateBd = new Date(timestampBd);

    let todayDate =
        dateBd.getUTCFullYear().toString() +
        '-' +
        (dateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        dateBd.getUTCDate().toString().padStart(2, '0');

    let tomorrowTimestampBd = timestampBd + 24 * 3600 * 1000;
    let tomorrowDateBd = new Date(tomorrowTimestampBd);

    let tomorrowDate =
        tomorrowDateBd.getUTCFullYear().toString() +
        '-' +
        (tomorrowDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        tomorrowDateBd.getUTCDate().toString().padStart(2, '0');

    let promoCode = 'ABCD' + timestamp.toString();
    let api = '/api/admin/promotion/add-new';

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode,
                startDate: tomorrowDate,
                endDate: tomorrowDate,
                discountRate: 15,
                useTime: 5,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the promo code is only spaces', (done) => {
        validator.isValidPromoCode('  ', (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'A valid Promo Code is required',
                error: '',
                discountRate: '',
                promotion: '',
            });

            done();
        });
    });

    it('should return error if the promo code is not available', (done) => {
        validator.isValidPromoCode(promoCode + 'A', (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'Invalid Promo Code',
                error: '',
                discountRate: '',
                promotion: '',
            });

            done();
        });
    });

    it('should return error if the start date is a future date', (done) => {
        validator.isValidPromoCode(promoCode, (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'Invalid Promo Code',
                error: '',
                discountRate: '',
                promotion: '',
            });

            done();
        });
    });

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '1',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15,
                useTime: 5,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the promo code is not active', (done) => {
        validator.isValidPromoCode(promoCode + '1', (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'Promo Code has expired',
                error: '',
                discountRate: '',
                promotion: '',
            });

            done();
        });
    });

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '2',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15,
                useTime: 0,
                active: true,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the use time is 0', (done) => {
        validator.isValidPromoCode(promoCode + '2', (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'Promo Code has expired',
                error: '',
                discountRate: '',
                promotion: '',
            });

            done();
        });
    });

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '3',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15,
                useTime: 10,
                active: true,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should success if the promo code is valid', (done) => {
        validator.isValidPromoCode(promoCode + '3', (result) => {
            expect(result.okay).to.be.equal(true);
            expect(result.message).to.be.eql('');
            expect(result.error).to.be.eql('');
            expect(result.discountRate).to.be.eql(15);

            done();
        });
    });
});

describe('Check applyPromoCodeIfAvailable() in validationHelper.js', () => {
    before((done) => {
        db.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        db.disconnect()
            .then(() => done())
            .catch((err) => done(err));
    });

    let timestamp = new Date().getTime();
    let timestampBd = timestamp + 6 * 3600 * 1000;
    let dateBd = new Date(timestampBd);

    let todayDate =
        dateBd.getUTCFullYear().toString() +
        '-' +
        (dateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        dateBd.getUTCDate().toString().padStart(2, '0');

    let tomorrowTimestampBd = timestampBd + 24 * 3600 * 1000;
    let tomorrowDateBd = new Date(tomorrowTimestampBd);

    let tomorrowDate =
        tomorrowDateBd.getUTCFullYear().toString() +
        '-' +
        (tomorrowDateBd.getUTCMonth() + 1).toString().padStart(2, '0') +
        '-' +
        tomorrowDateBd.getUTCDate().toString().padStart(2, '0');

    let promoCode = 'ABCD' + timestamp.toString();
    let api = '/api/admin/promotion/add-new';

    it('should return error if the promo code is only spaces', (done) => {
        validator.applyPromoCodeIfAvailable('  ', 300, (result) => {
            expect(result).to.be.eql({
                okay: false,
                message: 'A valid Promo Code is required',
                error: '',
                newPrice: 300,
            });

            done();
        });
    });

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '5',
                startDate: todayDate,
                endDate: tomorrowDate,
                discountRate: 0,
                useTime: 5,
                active: true,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return the price after applying discount correctly if the discount rate is 0', (done) => {
        validator.applyPromoCodeIfAvailable(promoCode + '5', 300, (testResult) => {
            expect(testResult).to.be.eql({
                okay: true,
                message: '',
                error: '',
                newPrice: 300,
            });

            done();
        });
    });

    it('should create a promo code', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '6',
                startDate: todayDate,
                endDate: tomorrowDate,
                discountRate: 30,
                useTime: 5,
                active: true,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return the price after applying discount correctly', (done) => {
        validator.applyPromoCodeIfAvailable(promoCode + '6', 300, (testResult) => {
            expect(testResult).to.be.eql({
                okay: true,
                message: '',
                error: '',
                newPrice: 210,
            });

            done();
        });
    });
});
