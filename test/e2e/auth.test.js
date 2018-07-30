const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const { checkOk } = request;

describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Easton John',
                year: 2000,
                email: 'easton@email.com',
                password: 'pwd123',
                roles: ['customer']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('can sign in a user', () => {
        return request.post('/api/auth/signin')
            .send({
                email: 'easton@email.com',
                password: 'pwd123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails on incorrect password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'easton@email.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('cannot signup with email already in use', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'easton@email.com',
                password: 'pwd123'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('gives a 401 error on bad email signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'easton@email.com',
                password: 'pwd123'
            });
    });
});