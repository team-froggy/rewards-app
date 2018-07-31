const router = require('express').Router();
const Bar = require('../models/bar');
const { updateOptions } = require('./_helpers');
const ensureOwner = require('../util/ensure-role')('owner');
const ensureAuth = require('../util/ensure-auth')();

module.exports = router

    .post('/', ensureAuth, ensureOwner, (req, res, next) => {
        // const isOwner = req.user.roles.includes('owner');
        // const query = { _id: req.params.id };
        // if(!isOwner) query.owner = req.user.id;

        Bar.create(req.body)
            .then(bar => res.json(bar))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Bar.find()
            .lean()
            .then(bars => {
                res.json(bars);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Bar.findById(req.params.id)
            .lean()
            .then(bar => {
                res.json(bar);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Bar.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(bar => res.json(bar))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Bar.findByIdAndRemove(req.params.id)
            .then(bar => res.json({ removed: !!bar }))
            .catch(next);
    });