const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../../../app');

describe('Check /api/user/product/fetch-products', () => {
    let api = '/api/user/product/fetch-products';

    it('should return error if product IDs are not sent', (done) => {
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

    it('should return error if productIds field is not an array', (done) => {
        request(app)
            .post(api)
            .send({
                productIds: 'ABC',
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

    it('should return success if productIds field is an empty array', (done) => {
        request(app)
            .post(api)
            .send({
                productIds: [],
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.products).to.be.a('array');
                expect(response.products.length).to.be.equal(0);
                expect(response.errorMessages).to.be.eql({
                    error: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
