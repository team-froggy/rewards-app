const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe('Sales API', () => {
    
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
            .then(({ body }) => sale = body);
    });

    let saleTwo;
    beforeEach(() => {
        return request
            .post('/api/sales')
            .send({
                bar: Types.ObjectId(),
                customer: Types.ObjectId(), 
                drinks: [{
                    type: 'wine',
                    name:'Merlot',
                    price: 5,
                    quantity: 2
                }],
                food: [{
                    type: 'dessert',
                    price: 5,
                    quantity: 1
                }],
                totalAmountSpent: 15
            })
            .then(({ body }) => saleTwo = body);
    });


    it('POST a transaction', () => {
        assert.isOk(sale._id);
    });

    it('GET a list of all sales/transactions', () => {
        return request
            .get('/api/sales')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [sale, saleTwo]);
            });
    });

    it('GET a list of all sales specific to an individual bar', () => {
        return request
            .get(`/api/sales/${sale.bar}`)
            .then(({ body }) => {
                assert.deepEqual(body, [sale]);
            });
    });
});
