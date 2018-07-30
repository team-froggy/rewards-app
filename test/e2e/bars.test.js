const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe.only('Bars API', () => {

    
    beforeEach(() => dropCollection('bars'));
    
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
            owner: Types.ObjectId()
        };
        return request
            .post('/api/bars')
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
            owner: Types.ObjectId()
        };
        return request
            .post('/api/bars')
            .send(bar)
            .then(checkOk)
            .then(({ body }) => {
                teardrop = body;
            });
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

    it('Gets a list of sales per bar', () => {

    });

    it('Gets a list of sales per customer', () => {

    });

});