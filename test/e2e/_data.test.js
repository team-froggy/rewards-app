const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const barsDataFile = join(__dirname, '../../lib/data/bars-data.json');
const usersDataFile = join(__dirname, '../../lib/data/users-data.json');
const salesDataFile = join(__dirname, '../../lib/data/sales-data.json');
const { dropCollection } = require('./_db');
const request = require('./request');

describe.skip('Seed data API', () => {

    beforeEach(() => dropCollection('bars'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('sales'));

    // let easton;
    // let kevin;
    // let carmen;
    // let journey;
    // let louis;
    // let token;
    
    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signup')
    //         .send({
    //             name: 'Easton',
    //             year: 1970,
    //             email: 'easton@acl-teamfroggy.com',
    //             password: 'frogger1',
    //             roles: ['admin', 'customer', 'owner']
    //         })
    //         .then(({ body }) => {
    //             token = body.token;
    //             easton = body.user;
    //         });
    // });

    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signup')
    //         .send({
    //             name: 'Kevin',
    //             year: 1970,
    //             email: 'kevin@acl-teamfroggy.com',
    //             password: 'frogger1',
    //             roles: ['admin', 'customer', 'owner']
    //         })
    //         .then(({ body }) => {
    //             token = body.token;
    //             kevin = body.user;
    //         });
    // });

    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signup')
    //         .send({
    //             name: 'Carmen',
    //             year: 1970,
    //             email: 'carmen@acl-teamfroggy.com',
    //             password: 'frogger1',
    //             roles: ['admin', 'customer', 'owner']
    //         })
    //         .then(({ body }) => {
    //             token = body.token;
    //             carmen = body.user;
    //         });
    // });

    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signup')
    //         .send({
    //             name: 'Journey',
    //             year: 2014,
    //             email: 'journey@acl-teamfroggy.com',
    //             password: 'frogger1',
    //             roles: ['customer']
    //         })
    //         .then(({ body }) => {
    //             token = body.token;
    //             journey = body.user;
    //         });
    // });

    // beforeEach(() => {
    //     return request
    //         .post('/api/auth/signup')
    //         .send({
    //             name: 'Louis',
    //             year: 2010,
    //             email: 'louis@acl-teamfroggy.com',
    //             password: 'frogger1',
    //             roles: ['owner', 'customer']
    //         })
    //         .then(({ body }) => {
    //             token = body.token;
    //             louis = body.user;
    //         });
    // });
    

    // beforeEach(() => {
    //     execSync(`mongoimport --db ${mongoose.connection.name} --collection users --drop --file ${usersDataFile}`);
    //     execSync(`mongoimport --db ${mongoose.connection.name} --collection bars --drop --file ${barsDataFile}`);
    //     execSync(`mongoimport --db ${mongoose.connection.name} --collection sales --drop --file ${salesDataFile}`);
    // });

    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db team_froggy_test --collection users --out users-data.json
    // mongoexport --db team_froggy_test --collection bars --out bars-data.json
    // mongoexport --db team_froggy_test --collection sales --out sales-data.json

    it('Seeds data', () => {

    });
});
