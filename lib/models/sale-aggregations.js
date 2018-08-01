module.exports = {
    averagesTicketAmt() {
        return pipeline;
    }
};


const groupByCustomer = {
    $group: {
     
        _id: { customer:  '$customer' },
        averageTicketAmt: { $avg: '$totalAmountSpent' } },
    count: { $sum: 1 },
    min: { $min: 'totalAmountSpent' },
    max: { $max: 'totalAmountSpent' }, 
};




const pipeline = [
    groupByCustomer 
];
