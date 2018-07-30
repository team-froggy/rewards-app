const router = require('express').Router();
const Sale = require('../models/sale');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No sale with id ${id}`
});

module.exports = router
    .post('/', (req, res, next) => {
        console.log('****BODY*****', req.body);
        Sale.create(req.body)
            .then(sales => res.json(sales))
            .catch(next);
    });