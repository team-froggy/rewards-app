const { assert } = require('chai');
const request = require('./request');
const { checkOk } = request;
const { dropCollection } = require('./_db');

describe.only('Users API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    let eastonJohn;
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
            .then(({ body }) => {
                token = body.token;
                eastonJohn = body.user;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('saves a user', () => {
        assert.isOk(eastonJohn._id);
    });

    it ('gets a list of users', () => {
        return request
            .get('/api/users')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [eastonJohn]);
            });
    });  
    
    it('gets a user by id', () => {
        return request
            .get(`/api/users/${eastonJohn._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                eastonJohn = body;
                assert.deepEqual(body, eastonJohn);
            });
    }); 

    it('updates only own user profile', () => {
        eastonJohn.email = 'eastonJohn@email.com';
        eastonJohn.year = 2002;
        return request
            .put(`/api/users/${eastonJohn._id}`)
            .set('Authorization', token)
            .send(eastonJohn)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.email, eastonJohn.email);
                assert.deepEqual(body.year,  eastonJohn.year); 
            });
    });
    
    it('deletes only own user profile', () => {
        return request
            .delete(`/api/users/${eastonJohn._id}`)
            .set('authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/users')
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, []);
            });
    });
   
});