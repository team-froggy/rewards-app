const router = require('express').Router();
const Bar = require('../models/bar');
const { updateOptions } = require('./_helpers');
// This is no use as an individual bar owner, one could only be an owner across the whole app
const ensureOwner = require('../util/ensure-role')('owner');
const ensureAuth = require('../util/ensure-auth')();

module.exports = router

    .post('/', ensureAuth, ensureOwner, (req, res, next) => {
        Bar.create(req.body)
            .then(bar => res.json(bar))
            .catch(next);
    })

    .get('/', ensureAuth, (req, res, next) => {
        Bar.find()
            .sort({ name: 1 })
            .lean()
            .select('name location hours phone')
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

    .put('/:id', ensureAuth, (req, res, next) => {
        // you can't trust req.body!
        // Either use as part of find, or preflight like you did in delete.
        // I created a common model static method to do this in both places
        Bar.checkIsOwner(req.params.id, req.user.id)
            .then(() => {
                return Bar.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    updateOptions
                );
            })
            .then(bar => res.json(bar))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Bar.checkIsOwner(req.params.id, req.user.id)
            .then(() => {
                return Bar.findByIdAndRemove(req.params.id);
            })
            .then(bar => res.json({ removed: !!bar }))
            .catch(next);
    });