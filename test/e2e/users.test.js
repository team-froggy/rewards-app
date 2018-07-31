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
                year: '2000',
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
    
   
});