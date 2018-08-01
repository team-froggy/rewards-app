const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const { checkOk } = request;
// const { Types } = require('mongoose');

describe.only('Sales API', () => {
    
    beforeEach(() => {
        dropCollection('sales');
        dropCollection('users');
        dropCollection('bars');
    });

    let user;
    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Easton',
                year: 1990,
                email: 'easton@acl.com',
                password: 'password',
                roles: ['customer', 'owner', 'admin']
            })
            .then(({ body }) => {
                token = body.token;
                user = body.user;
            });
    });

    let lifeOfRiley;
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

    let teardrop;
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
            .set('Authorization', token)
            .send({
                bar: teardrop._id,
                customer: user._id, 
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
            .set('Authorization', token)
            .send({
                bar: lifeOfRiley._id,
                customer: user._id, 
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

    const makeSimple = (bar, sale) => {
        const simple = {
            _id: sale._id,
            bar: {
                _id: bar._id,
                name: bar.name
            },
            customer: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            totalAmountSpent: sale.totalAmountSpent
        };
        if(sale.drinks) {
            simple.drinks = sale.drinks;
        }
        if(sale.food) {
            simple.food = sale.food;
        }
        return simple;
    };

    it('POST a transaction', () => {
        assert.isOk(sale._id);
    });

    it('GET a list of all sales/transactions specific to bar owner', () => {
        return request
            .get('/api/sales')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                delete body[0].__v;
                delete body[0].createdAt;
                delete body[0].updatedAt;
                delete body[1].__v;
                delete body[1].createdAt;
                delete body[1].updatedAt;
                assert.deepEqual(body, [makeSimple(teardrop, sale), makeSimple(lifeOfRiley, saleTwo)]);
            });
    });

    it('GET a list of all sales specific to an individual bar', () => {
        return request
            .get(`/api/sales/${sale.bar}`)
            .set('Authorization', token)
            .then(({ body }) => {
                delete body[0].__v;
                delete body[0].createdAt;
                delete body[0].updatedAt;
                assert.deepEqual(body, [makeSimple(teardrop, sale)]);
            });
    });

    it('GET the average ticket amount spent by customer', () => {
        return request
            .get('api/sales/average-ticket-amt')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isOk(body[0].averageTicketAmt);
            });
    });


    it('Updates a sales transaction if bar owner', () => {
        sale.food[0].type = 'starter';
        sale.totalAmountSpent = 77;
        return request
            .put(`/api/sales/${sale._id}`)
            .set('Authorization', token)
            .send(sale)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.food.type, sale.food.type);
                assert.deepEqual(body.totalAmountSpent, sale.totalAmountSpent);
            });
    });

    it('Deletes sales transaction by business owner', () => {
        return request
            .delete(`/api/sales/${sale._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request
                    .get('/api/sales')
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                delete body[0].__v;
                delete body[0].createdAt;
                delete body[0].updatedAt;
                assert.deepEqual(body, [makeSimple(lifeOfRiley, saleTwo)]);
            });
    });

});

