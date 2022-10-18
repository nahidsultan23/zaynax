const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../../../app');

describe('Check /api/admin/auth/login', () => {
    let api = '/api/admin/auth/login';

    it('should return error if User ID and Password are not provided', (done) => {
        request(app)
            .post(api)
            .send()
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    userId: 'User ID is required',
                    password: 'Password is required',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if a valid User ID is not provided', (done) => {
        request(app)
            .post(api)
            .send({
                userId: 'test_user',
                password: 'Easy',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    userId: 'Invalid User ID',
                    password: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should return error if the password is not correct', (done) => {
        request(app)
            .post(api)
            .send({
                userId: 'Test_User2021',
                password: 'Easy',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(false);
                expect(response.errorMessages).to.be.eql({
                    userId: '',
                    password: 'Wrong Password',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should log in if correct User ID and Password are provided', (done) => {
        request(app)
            .post(api)
            .send({
                userId: 'Test_User2021',
                password: 'Easy_123',
            })
            .then((res) => {
                let response = res.body;

                expect(response.success).to.be.equal(true);
                expect(response.errorMessages).to.be.eql({
                    userId: '',
                    password: '',
                });

                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
