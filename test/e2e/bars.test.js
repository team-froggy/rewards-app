const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;

describe('Bars API', () => {

    
    beforeEach(() => dropCollection('bars'));
    beforeEach(() => dropCollection('sales'));
    beforeEach(() => dropCollection('users'));

    let token;
    let user;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Easton John',
                year: 2000,
                email: 'easton@email.com',
                password: 'pwd123',
                roles: ['customer', 'owner', 'admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                user = body.user;
            });
    });
    
    let lifeOfRiley;
    let teardrop;
    beforeEach(() => {
        let bar = {
            name: 'Life of Riley',
            location: {
                address: 'Somewhere in the Pearl',
                city: 'Portland',
                state: 'OR',
                zip: '97777'
            },
            phone: '9711234567',
            hours: 'All day err day',
            owner: user._id
        };
        return request
            .post('/api/bars')
            .set('Authorization', token)
            .send(bar)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete body.createdAt;
                delete body.updatedAt;
                lifeOfRiley = body;
            });
    });

    beforeEach(() => {
        let bar = {
            name: 'Teardrop',
            location: {
                address: 'Also in the Pearl',
                city: 'Portland',
                state: 'OR',
                zip: '97777'
            },
            phone: '5031234567',
            hours: 'Lots of hours',
            owner: user._id
        };
        return request
            .post('/api/bars')
            .set('Authorization', token)
            .send(bar)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete body.createdAt;
                delete body.updatedAt;
                teardrop = body;
            });
    });

    it('Saves a bar', () => {
        assert.isOk(lifeOfRiley);
    });

    it('Gets a list of bars', () => {
        return request
            .get('/api/bars')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body[0].name, lifeOfRiley.name);
                assert.deepEqual(body[1].name, teardrop.name);
            });
    });

    it('Gets a bar by _id', () => {
        return request
            .get(`/api/bars/${lifeOfRiley._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                delete body.__v;
                delete body.createdAt;
                delete body.updatedAt;
                assert.deepEqual(body.name, lifeOfRiley.name);
            });
            
    });

    it('Updates a bar by _id if owner of the bar', () => {
        lifeOfRiley.name = 'Life of SMILEY';
        lifeOfRiley.location.city = 'London';
        return request
            .put(`/api/bars/${lifeOfRiley._id}`)
            .set('Authorization', token)
            .send(lifeOfRiley)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.name, lifeOfRiley.name);
                assert.deepEqual(body.location.city, lifeOfRiley.location.city);
            });
    });

    it('Deletes a bar if owner', () => {
        return request
            .delete(`/api/bars/${lifeOfRiley._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/bars')
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].name, teardrop.name);
            });
    });

});