const router = require('express').Router();
const Sale = require('../models/sale');
const Bar = require('../models/bar');
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureOwner = require('../util/ensure-role')('owner');
const ensureAdmin = require('../util/ensure-role')('admin');
const { updateOptions } = require('./_helpers');

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

    .get('/revenue-by-owner', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.find({ owner: req.user.id })
            .lean()
            .then(bars => {
                let barList = bars.map(bar => bar._id);
                Sale.totalRevenueByOwner(barList)
                    .then(results => {
                        res.json(results);
                    })
                    .catch(next);
            });
    })

    .get('/premium-customers/:id', ensureAuth, ensureOwner, (req, res, next) => {
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
                    Sale.premiumCustomers(bar._id)
                        .then(results => {
                            return User.populate(results, { path: '_id', select: 'name email' });
                        })
                        .then(results => res.json(results))
                        .catch(next);
                }
            });
    })

    .get('/bar-revenue/:id', ensureAuth, ensureOwner, (req, res, next) => {
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
                    Sale.totalRevenueByBar(bar._id)
                        .then(results => res.json(results))
                        .catch(next);
                }
            });
    })

    .get('/sales-by-bar', ensureAuth, ensureAdmin, (req, res, next) => {
        Sale.salesByBar()
            .then(results => {
                return Bar.populate(results, { path: '_id', select: 'name' });
            })
            .then(results => {
                res.json(results);
            })
            .catch(next);
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
                            if(!sales) next(make404(req.params.id));
                            else res.json(sales);
                        })
                        .catch(next);
                }
            });
    })

    .put('/:id', ensureAuth, ensureOwner, (req, res, next) => {
        Sale.findById(req.params.id)
            .lean()
            .populate({
                path: 'bar',
                select: 'owner'
            })
            .then(sale => {
                if(!sale) next(make404(req.params.id));
                
                else if(req.user.id !== sale.bar.owner.toString()) {
                    next(new HttpError({
                        code: 403,
                        message: 'Forbidden - Not registered owner'
                    }));
                }
                else {
                    Sale.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        updateOptions
                    )
                        .then(sale => {
                            res.json(sale);
                        })
                        .catch(next);
                }
            });
    })
    
    .delete('/:id', ensureAuth, ensureOwner, (req, res, next) => {
        Sale.findById(req.params.id)
            .lean()
            .populate({
                path: 'bar',
                select: 'owner'
            })
            .then(sale => {
                if(req.user.id !== sale.bar.owner.toString()) {
                    next(new HttpError({
                        code: 403,
                        message: 'Forbidden - Not registered owner'
                    }));
                }
                else {
                    Sale.findByIdAndRemove(req.params.id)
                        .then(sale => res.json({ removed: !!sale }))
                        .catch(next);
                }
            });
    });