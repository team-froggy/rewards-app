const { assert } = require('chai');
const Bar = require('../../lib/models/bar');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');

describe('Bar model', () => {

    it('Validates good model', () => {
        const data = {
            name: 'Red Star',
            location: {
                address: '503 SW Alder St.',
                city: 'Portland',
                state: 'OR',
                zip: '97204'
            },
            phone: '5032220005',
            hours: 'Mon 8:00am - 2:00pm & 5:30pm - 10:00pm, Tue 8:00am - 2:00pm & 5:30pm - 10:00pm, Wed 8:00am - 2:00pm & 5:30pm - 10:00pm, Thu 8:00am - 2:00pm & 5:30pm - 10:00pm, Fri 8:00am - 2:00pm & 5:30pm - 10:00pm, Sat 9:00am - 2:30pm & 5:30pm - 10:00pm, Sun 9:00am - 2:30pm & 5:30pm - 9:00pm',
            owner: Types.ObjectId()
        };

        const bar = new Bar(data);

        const json = bar.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(bar.validateSync());
    });

    it('Validates required fields', () => {
        const review = new Bar({});
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.owner.kind, 'required'); 
    });
});