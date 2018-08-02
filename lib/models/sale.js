const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema ({
    bar: {
        type: Schema.Types.ObjectId,
        ref: 'Bar',
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drinks: [{
        type: {
            type: String,
            enum: ['beer', 'cocktail', 'wine', 'non-alcoholic'],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    food: [{
        type: {
            type: String,
            enum: ['starter', 'entree', 'dessert'],
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmountSpent: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
}
);


schema.statics.totalRevenueByOwner = function(barList) {
    return this.aggregate([
        { $match: { bar: { $in: barList } } },
        { $group: { _id: 'Revenue', totalSales: { $sum: '$totalAmountSpent' } } }
    ]);
};

schema.statics.averageTicketAmt = function(oneBar) {
    return this.aggregate([
        { $match: { bar: oneBar } },
        { $unwind: '$drinks' },
        { $unwind: '$food' },
        { $group: {
            _id: '$customer',
            count: { $sum: 1 },
            sum: { $sum: '$totalAmountSpent' },
            averageTicketAmt: { $avg: '$totalAmountSpent' },
            min: { $min: '$totalAmountSpent' },
            max: { $max: '$totalAmountSpent' },
            drinkQuantity: { $sum: '$drinks.quantity' },
            drinkTypes: { $addToSet: '$drinks.type' },
            foodQuantity: { $sum: '$food.quantity' },
            foodTypes: { $addToSet: '$food.type' }
        }
        },
        { $sort: { sum: -1 } }
    ]);
};

module.exports = mongoose.model('Sale', schema);