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
    .post('/', ensureAuth, ensureOwner, (req, res, next) => {
        Sale.create(req.body)
            .then(sales => res.json(sales))
            .catch(next);
    })

    .get('/', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.find({ owner: req.user.id })
            .lean()
            .then(bars => {
                let barList = bars.map(bar => bar._id);
                Sale.find({ bar: { $in: barList } })
                    .lean()
                    .populate({
                        path: 'bar',
                        select: 'name'
                    })
                    .populate({
                        path: 'customer',
                        select: 'name email'
                    })
                    .then(sales => res.json(sales))
                    .catch(next);
            });
    })

    .get('/:id', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.findById(req.params.id)
            .lean()
            .then(bar => {
                if(req.user.id !== bar.owner.toString()) {
                    next(new HttpError({
                        code: 403,
                        message: 'Forbidden - Not registered owner'
                    }));
                }
                else {
                    Sale.find({ bar: req.params.id })
                        .lean()
                        .populate({
                            path: 'bar',
                            select: 'name'
                        })
                        .populate({
                            path: 'customer',
                            select: 'name email'
                        })
                        .then(sales => {
                            if(!sales) {
                                next(make404(req.params.id));
                            }
                            else {
                                res.json(sales);
                            }
                        })
                        .catch(next);
                }
            });
    });