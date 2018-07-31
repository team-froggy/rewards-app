const router = require('express').Router();
const Sale = require('../models/sale');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth');
//const ensureRole = require('../util/ensure-role');

const make404 = id => new HttpError({
    code: 404,
    message: `No sales with id ${id}`
});

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        Sale.create(req.body)
            .then(sales => res.json(sales))
            .catch(next);
    })
    .get('/', ensureAuth, (req, res, next) => {
        Sale.find({})
            .lean()
            .then(sales => res.json(sales))
            .catch(next);
    })
    .get('/:id', ensureAuth, (req, res, next) => {
        Sale.find({ bar: req.params.id })
            .lean()
            .then(sales => {
                if(!sales) {
                    next(make404(req.params.id));
                }
                else {
                    res.json(sales);
                }
            })
            .catch(next);
    });