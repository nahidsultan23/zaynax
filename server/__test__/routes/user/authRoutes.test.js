const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../../../app');

describe('Check /api/user/auth/register', () => {
    let api = '/api/user/auth/register';

    it('should return error if the phone number and password are not provided', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    phoneNumber: 'Phone Number is required',
                    password: 'Password is required',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the phone number and the password are invalid', (done) => {
        request(app)
            .post(api)
            .send({
                phoneNumber: '012345',
                password: '  ',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    phoneNumber: 'A valid Phone Number is required',
                    password: 'A valid Password is required',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return true if the phone number and the password are valid', (done) => {
        request(app)
            .post(api)
            .send({
                phoneNumber: '01999999999',
                password: '12345',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.errorMessages).to.be.eql({
                    phoneNumber: '',
                    password: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
