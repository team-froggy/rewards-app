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
        { $group: { 
            _id: 'Revenue', 
            totalSales: { $sum: '$totalAmountSpent' } 
        } }
    ]);
};

schema.statics.premiumCustomers = function(oneBar) {
    return this.aggregate([
        { $match: { bar: oneBar } },
        { $group: {
            _id: '$customer',
            totalTickets: { $sum: 1 },
            totalAmtSpent: { $sum: '$totalAmountSpent' },
            avgAmtSpent: { $avg: '$totalAmountSpent' },
            min: { $min: '$totalAmountSpent' },
            max: { $max: '$totalAmountSpent' },
        }
        },
        { $sort: { sum: -1 } }
    ]);
};

module.exports = mongoose.model('Sale', schema);