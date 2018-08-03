const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-services');
const ensureAuth = require('../util/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })   

    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);
        let user;
        User.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }

                const user = new User(body);
                user.generateHash(password);
                return user.save();
            }) 
            .then(saved => {
                user = saved;
                return saved;
            })
            .then(user => tokenService.sign(user))
            .then(token => {
                delete user.hash;
                res.json({ token, user });
            })
            .catch(next);

    })
    
    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);
        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                return tokenService.sign(user);    
            })
            .then(token => res.json({ token }))
            .catch(next);
    });