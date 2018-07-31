const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});


module.exports = router

    .get('/', ensureAuth, (req, res, next) => {
        User.find()
            .lean()
            .then(users => res.json(users))
            .catch(next);
    })
    
    .get('/:id', ensureAuth, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .select('-__v -email -hash -roles')
            .then(user => {
                if(!user) next(make404(req.params.id));
                else {
                    res.json(user);
                }
            })
            .catch(next);
    
    });