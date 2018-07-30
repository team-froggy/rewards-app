const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Sale = require('../../lib/models/sale');
const { Types } = require('mongoose');

describe('Sale model', () => {
    
    it('validates a good model', () => {
        const data = {
            bar: Types.ObjectId(),
            customer: Types.ObjectId(),
            drinks: [{
                type: 'beer',
                name: 'boneyard',
                price: 4,
                quantity: 1
            }],
            food:[{
                type: 'starter',
                price: 4,
                quantity: 1
            }],
            totalAmountSpent: 8
        };

        const sale = new Sale(data);
        const json = sale.toJSON();
        delete json._id;
        delete json.drinks[0]._id;
        delete json.food[0]._id;
        
        assert.deepEqual(json, data);
        assert.isUndefined(sale.validateSync());
    });

    it('validates required fields (drinks, food, amount spent)', () => {
        const sale = new Sale({
            drinks:[{}],
            food:[{}]
        });
        const errors = getErrors(sale.validateSync(), 10);
        assert.equal(errors.bar.kind, 'required');
        assert.equal(errors.customer.kind, 'required');
        assert.equal(errors['drinks.0.type'].kind, 'required');
        assert.equal(errors['drinks.0.name'].kind, 'required');
        assert.equal(errors['drinks.0.price'].kind, 'required');
        assert.equal(errors['drinks.0.quantity'].kind, 'required');
        assert.equal(errors['food.0.type'].kind, 'required');
        assert.equal(errors['food.0.price'].kind, 'required');
        assert.equal(errors['food.0.quantity'].kind, 'required');
        assert.equal(errors.totalAmountSpent.kind, 'required');
    });
});