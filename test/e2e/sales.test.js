const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe.only('Sales API', () => {
    
    beforeEach(() => {
        dropCollection('sales');
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
            .then(({ body }) => {
                console.log('****BODY****', body);
                sale = body;
            });
    });

    it('saves a sale transaction', () => {
        assert.isOk(sale._id);
    });
});
