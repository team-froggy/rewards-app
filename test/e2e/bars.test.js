const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe.only('Bars API', () => {

    
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
                teardrop = body;
            });
    });

    let sale;
    beforeEach(() => {
        return request
            .post('/api/sales')
            .send({
                bar: Types.ObjectId(),
                customer: Types.ObjectId(), 
                drinks: [{
                    type: 'beer',
                    name:'Breakside IPA',
                    price: 5,
                    quantity: 2
                }],
                food: [{
                    type: 'entree',
                    price: 10,
                    quantity: 1
                }],
                totalAmountSpent: 20
            })
            .then(({ body }) => sale = body);
    });



    it('Saves a bar', () => {
        assert.isOk(lifeOfRiley);
    });

    it('Gets a list of bars', () => {
        return request
            .get('/api/bars')
            .then(({ body }) => {
                assert.deepEqual(body, [lifeOfRiley, teardrop]);
            });
    });

    it('Gets a bar by _id', () => {
        return request
            .get(`/api/bars/${lifeOfRiley._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, lifeOfRiley);
            });
            
    });

    it('Updates a bar by _id if owner of the bar', () => {
        lifeOfRiley.name = 'Life of SMILEY';
        lifeOfRiley.location.city = 'London';
        return request
            .put(`/api/bars/${lifeOfRiley._id}`)
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
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/bars');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [teardrop]);
            });
    });

});