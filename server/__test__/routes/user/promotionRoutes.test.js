const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const db = require('../../../db/db');
const app = require('../../../app');

process.env.NODE_ENV = 'test';

describe('Check /api/user/promotion/check-validity', () => {
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

    it('should create a promo code', (done) => {
        request(app)
            .post('/api/admin/promotion/add-new')
            .send({
                promoCode: promoCode,
                startDate: todayDate,
                endDate: tomorrowDate,
                discountRate: 15,
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

    let api = '/api/user/promotion/check-validity';

    it('should return error if Promo Code is not provided', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: 'Invalid Promo Code',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if Promo Code is only spaces', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: '   ',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    promoCode: 'A valid Promo Code is required',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return success if the promo code is valid', (done) => {
        request(app)
            .post(api)
            .send({
                promoCode: promoCode,
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.discountRate).to.be.equal(15);
                expect(response.errorMessages).to.be.eql({
                    promoCode: '',
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
