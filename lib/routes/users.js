const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});


module.exports = router

    .get('/', (req, res, next) => {
        User.find()
            .lean()
            .then(users => res.json(users))
            .catch(next);
    });