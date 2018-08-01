const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const barsDataFile = join(__dirname, '../../lib/data/bars-data.json');
const usersDataFile = join(__dirname, '../../lib/data/users-data.json');
const salesDataFile = join(__dirname, '../../lib/data/sales-data.json');
const { dropCollection } = require('./_db');
const request = require('./request');
const { checkOk } = request;

describe('Seed data API', () => {

    beforeEach(() => dropCollection('bars'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('sales'));

    beforeEach(() => {
        execSync(`mongoimport --db ${mongoose.connection.name} --collection users --file ${usersDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection bars --file ${barsDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection sales --file ${salesDataFile}`);
    });
    

    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db team_froggy_test --collection users --out users-data.json
    // mongoexport --db team_froggy_test --collection bars --out bars-data.json
    // mongoexport --db team_froggy_test --collection sales --out sales-data.json

    it('Seeds data', () => {

    });
});
