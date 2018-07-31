const router = require('express').Router();
const Bar = require('../models/bar');
const { updateOptions } = require('./_helpers');
const ensureOwner = require('../util/ensure-role')('owner');
const ensureAuth = require('../util/ensure-auth')();
const { HttpError } = require('../util/errors');

module.exports = router

    .post('/', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.create(req.body)
            .then(bar => res.json(bar))
            .catch(next);
    })

    .get('/', ensureAuth, (req, res, next) => {
        Bar.find()
            .lean()
            .then(bars => {
                res.json(bars);
            })
            .catch(next);
    })

    .get('/:id', ensureAuth, (req, res, next) => {
        Bar.findById(req.params.id)
            .lean()
            .then(bar => {
                res.json(bar);
            })
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureOwner, (req, res, next) => {
        if(req.body.owner === req.user.id) {
            Bar.findByIdAndUpdate(
                req.params.id,
                req.body,
                updateOptions
            )
                .then(bar => res.json(bar))
                .catch(next);
        } else {
            next(new HttpError({
                code: 403,
                message: 'Forbidden - Not registered owner'
            }));
        }
    })

    .delete('/:id', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.findById(req.params.id)
            .lean()
            .select('owner')
            .then(bar => {
                if(bar.owner.toString() === req.user.id) {
                    Bar.findByIdAndRemove(req.params.id)
                        .then(bar => res.json({ removed: !!bar }))
                        .catch(next);
                } else {
                    next(new HttpError({
                        code: 403,
                        message: 'Forbidden - Not registered owner'
                    }));
                }
            })
            .catch(next);
    });