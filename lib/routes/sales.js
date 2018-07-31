const router = require('express').Router();
const Sale = require('../models/sale');
const Bar = require('../models/bar');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureOwner = require('../util/ensure-role')('owner');

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
    .get('/', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.find({ owner: req.user.id })
            .lean()
            .select('name')
            .then(bars => {
                let barList = bars.map(bar => bar._id);
                Sale.find({ bar: { $in: barList } })
                    .lean()
                    .then(sales => res.json(sales))
                    .catch(next);
            });
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