const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-auth')('admin');
const { updateOptions } = require('./_helpers');

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router

    .get('/', ensureAuth, ensureAdmin, (req, res, next) => {
        User.find()
            .lean()
            .select('name email year roles')
            .then(users => res.json(users))
            .catch(next);
    })
    
    .get('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            // why wouldn't you want email and roles?
            .select('-__v -hash')
            .then(user => {
                if(!user) next(make404(req.params.id));
                else {
                    res.json(user);
                }
            })
            .catch(next);
    })   
    
    // be careful, this could overwrite the hash.
    // do you need this?
    .put('/:id', ensureAuth, (req, res, next) => {
        if(req.body._id === req.user.id) {
            User.findByIdAndUpdate(
                req.params.id,
                req.body,
                updateOptions
            )
                .then(user => res.json(user))
                .catch(next);
        } else {
            next(new HttpError({
                code: 403,
                message: 'Cannot Update - Not registered user!'
            }));
        }

    })

    // probably don't need this route
    .delete('/:id', ensureAuth, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .then(user => {
                if(user._id.toString() === req.user.id) {
                    User.findByIdAndRemove(req.params.id)
                        .lean()
                        .then(user => res.json({ removed: !!user }))
                        .catch(next);
                } else {
                    next(new HttpError({
                        code: 403,
                        message: 'Cannot Delete - Not registered user!'
                    })); 
                }

            });
        
    });
  