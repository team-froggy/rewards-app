const router = require('express').Router();
const Bar = require('../models/bar');
const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
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