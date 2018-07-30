const router = require('express').Router();
const Bar = require('../models/bar');
// const { updateOptions } = require('./_helpers');

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
    });