const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const db = require('../../../db/db');
const app = require('../../../app');

process.env.NODE_ENV = 'test';

describe('Check /api/admin/promotion/add-new', () => {
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

    let api = '/api/admin/promotion/add-new';

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

    it('should return error if the required fields are not provided', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: 'Promo Code is required',
                    startDate: 'Start Date is required',
                    endDate: 'End Date is required',
                    discountRate: 'Discount Rate is required',
                    useTime: 'Use Time is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the promo code is only spaces', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: ' ',
                startDate: tomorrowDate,
                endDate: tomorrowDate,
                discountRate: 15,
                useTime: 20,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: 'A valid Promo Code is required',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return errors for the corresponding fields', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: 1234,
                endDate: 1234,
                discountRate: '15.3.2',
                useTime: 1.3,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: 'A valid date is required',
                    endDate: 'A valid date is required',
                    discountRate: 'A valid Discount Rate is required',
                    useTime: 'A valid Use Time is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the use time is a negative number', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15,
                useTime: -2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: 'A valid Use Time is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return errors if the start date and the end date are past dates', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: yesterdayDate,
                endDate: yesterdayDate,
                discountRate: 15,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: 'A past date is not acceptable',
                    endDate: 'A past date is not acceptable',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the end date is before the start date', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: tomorrowDate,
                endDate: todayDate,
                discountRate: 15,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: 'End Date cannot be before the Start Date',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the discount rate is less than 0', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: tomorrowDate,
                endDate: tomorrowDate,
                discountRate: -15,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: 'A valid Discount Rate is required',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the discount rate is bigger than 100', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: 'A',
                startDate: tomorrowDate,
                endDate: tomorrowDate,
                discountRate: 101,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: 'A valid Discount Rate is required',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    let time = new Date().getTime().toString();
    let promoCode = 'A b cd EF ' + time;

    it('should success if all fields are provided correctly', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode,
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15.3265487,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.promoCode).to.be.equal('ABCDEF' + time);
                expect(response.discountRate).to.be.equal(15.32);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the promo code already exists', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode,
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 15.3265487,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: 'Promo Code already exists',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should create the promo code if the discount rate is 0', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '1',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 0,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.promoCode).to.be.equal('ABCDEF' + time + '1');
                expect(response.discountRate).to.be.equal(0);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should create the promo code if the use time is 0', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode + '2',
                startDate: todayDate,
                endDate: todayDate,
                discountRate: 30.25468,
                useTime: 0,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.promoCode).to.be.equal('ABCDEF' + time + '2');
                expect(response.discountRate).to.be.equal(30.25);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    startDate: '',
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});

describe('Check /api/admin/promotion/update', () => {
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

    let api = '/api/admin/promotion/update';

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

    it('should return error if the promo code Id is not provided', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    endDate: '',
                    discountRate: '',
                    useTime: '',
                    error: 'Invalid request',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the promo code is provided but the other fields are not', (done) => {
        request(app)
            .post(api)
            .send({
                promoCodeId: '123',
                endDate: '',
                discountRate: '',
                useTime: '',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    endDate: 'End Date is required',
                    discountRate: 'Discount Rate is required',
                    useTime: 'Use Time is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the use time is a negative number', (done) => {
        request(app)
            .post(api)
            .send({
                promoCodeId: '123',
                endDate: tomorrowDate,
                discountRate: 10,
                useTime: -2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    endDate: '',
                    discountRate: '',
                    useTime: 'A valid Use Time is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the end date is a past date', (done) => {
        request(app)
            .post(api)
            .send({
                promoCodeId: '123',
                endDate: yesterdayDate,
                discountRate: 10,
                useTime: 2,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    endDate: 'A past date is not acceptable',
                    discountRate: '',
                    useTime: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
