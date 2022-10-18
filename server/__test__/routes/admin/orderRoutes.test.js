const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../../../app');

describe('Check /api/admin/order/change-status', () => {
    let api = '/api/admin/order/change-status';

    it('should return error if order id is not sent', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    error: 'Invalid request',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if order id is only spaces', (done) => {
        request(app)
            .post(api)
            .send({
                orderId: '  ',
                status: 'Confirm',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    error: 'Invalid request',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the status is not Confirm or Cancel', (done) => {
        request(app)
            .post(api)
            .send({
                orderId: 'A',
                status: 'Pending',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    error: 'Invalid request',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
