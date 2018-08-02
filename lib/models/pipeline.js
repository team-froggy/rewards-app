module.exports = {
    premiumCustomers(barId) {
        const onePipeline = pipeline.slice();
        onePipeline.unshift(matchBar(barId));
        return onePipeline;
    }
};

const matchBar = barId => ({
    $match: { barId }
});

const unwindFood = {
    $unwind: '$food'
};

const groupByFood = {
    $group: {
        _id: '$customer',
        foodQty: { $sum: '$food.quantity' },
        amtSpent: { $sum: '$food.price' },
        foodTypes: { $addToSet: '$food.type' } 
    } 
};

const pipeline = [
    unwindFood,
    groupByFood
];