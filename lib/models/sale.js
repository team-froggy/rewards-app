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

// now these can be used in all aggregations!
const matchByBars = bars => ({ $match: { bar: { $in: bars } } });
const matchByBar = bar => ({ $match: { bar: bar } });

const totalSalesByOwner = { 
    $group: { 
        _id: 'owner_revenue', 
        totalSales: { $sum: '$totalAmountSpent' } 
    } 
};

const unwindDrinks = { $unwind: '$drinks' };

const totalSalesByDrinkType = { 
    $group: {
        _id: '$drinks.type',
        qty: { $sum: '$drinks.quantity' }
    } 
};  

schema.statics.totalRevenueByOwner = function(barList) {
    // this probably doesn't work because you need to unw
    return this.aggregate([
        matchByBars(barList),
        totalSalesByOwner
    ]);
};

schema.statics.totalDrinkCount = function(barList) {
    return this.aggregate([
        matchByBars(barList),
        unwindDrinks,
        totalSalesByDrinkType  
    ]);
};
schema.statics.drinkCountByBar = function(bar) {
    return this.aggregate([
        matchByBar(bar),
        unwindDrinks,
        totalSalesByDrinkType  
    ]);
};

schema.statics.totalFoodCount = function(barList) {
    return this.aggregate([
        { $match: { bar: { $in: barList } } },
        { $unwind: '$food' },
        { $group: {
            _id: '$food.type',
            qty: { $sum: '$food.quantity' }
        } }  
    ]);
};

schema.statics.foodCountByBar = function(bar) {
    return this.aggregate([
        { $match: { bar: bar } },
        { $unwind: '$food' },
        { $group: {
            _id: '$food.type',
            qty: { $sum: '$food.quantity' }
        } }  
    ]);
};

schema.statics.adminTotalDrinkCount = function() {
    return this.aggregate([
        { $unwind: '$drinks' },
        { $group: {
            _id: '$bar',
            drinkQty: { $sum: '$drinks.quantity' }
        } }  
    ]);
};

schema.statics.adminTotalFoodCount = function() {
    return this.aggregate([
        { $unwind: '$food' },
        { $group: {
            _id: '$bar',
            foodQty: { $sum: '$food.quantity' }
        } }  
    ]);
};

schema.statics.totalRevenueByBar = function(bar) {
    return this.aggregate([
        { $match: { bar: bar } },
        { $group: { 
            _id: bar, 
            totalSales: { $sum: '$totalAmountSpent' } 
        } }
    ]);
};

schema.statics.premiumCustomers = function(bar) {
    return this.aggregate([
        { $match: { bar: bar } },
        { $group: {
            _id: '$customer',
            totalTickets: { $sum: 1 },
            totalAmtSpent: { $sum: '$totalAmountSpent' },
            avgAmtSpent: { $avg: '$totalAmountSpent' },
            min: { $min: '$totalAmountSpent' },
            max: { $max: '$totalAmountSpent' },
        }
        },
        { $sort: { totalAmtSpent: -1 } }
    ]);
};

schema.statics.adminSalesByBar = function() {
    return this.aggregate([
        { $group: {
            _id: '$bar',
            totalRevenue: { $sum: '$totalAmountSpent' },
            totalTickets: { $sum: 1 },
            avgTicketValue: { $avg: '$totalAmountSpent' }
        }
        },
        { $sort: { totalRevenue : -1 } }
    ]);
};

schema.statics.ownerSalesByBar = function(barList) {
    return this.aggregate([
        { $match: { bar: { $in: barList } } },
        { $group: {
            _id: '$bar',
            totalRevenue: { $sum: '$totalAmountSpent' },
            totalTickets: { $sum: 1 },
            avgTicketValue: { $avg: '$totalAmountSpent' }
        }
        },
        { $sort: { totalRevenue : -1 } }
    ]);
};

module.exports = mongoose.model('Sale', schema);