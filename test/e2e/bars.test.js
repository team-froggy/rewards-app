const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;

describe.only('Bars API', () => {

    let lifeOfRiley;

    beforeEach(() => dropCollection('bars'));

    beforeEach(() => {
        let barData = {
            name: 'Life of Riley',
            location: {
                address: 'Somewhere in the Pearl',
                city: 'Portland',
                state: 'OR',
                zip: '97777'
            },
            phone: '9711234567',
            hours: 'All day err day',
            owner: 'INSERT ID OF USER HERE'
        };
        return request
            .post('/api/bars')
            .send(barData)
            .then(checkOk)
            .then(({ body }) => {
                lifeOfRiley = body;
            });
    });

    it('Saves a bar', () => {
        assert.isOk(lifeOfRiley);
    });

    it('Gets a list of bars', () => {

    });

    it('Gets a bar by _id', () => {

    });

    it('Gets a list of sales per bar', () => {

    });

    it('Gets a list of sales per customer', () => {

    });

});