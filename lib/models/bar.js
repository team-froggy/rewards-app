const mongoose = require('mongoose');
const { Schema } = mongoose;
const { HttpError } = require('../util/errors');

const schema = new Schema({
    name: String,
    location: {
        address: String,
        city: String,
        state: String,
        zip: {
            type: String,
            maxlength: 5
        }
    },
    phone: {
        type: String,
        maxlength: 10
    },
    hours: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
});

schema.statics.checkIsOwner = function(id, userId) {
    return this.findById(id)
        .select('owner')
        .lean()
        .then(({ owner }) => {
            if(owner.toString() !== userId) {
                throw new HttpError({
                    code: 403,
                    message: 'Forbidden - Not registered owner'
                });
            }
        });
};

module.exports = mongoose.model('Bar', schema);