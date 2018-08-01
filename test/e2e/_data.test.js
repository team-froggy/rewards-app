const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const barsDataFile = join(__dirname, '../../lib/data/bars-data.json');
const usersDataFile = join(__dirname, '../../lib/data/users-data.json');
const salesDataFile = join(__dirname, '../../lib/data/sales-data.json');
const { dropCollection } = require('./_db');
const request = require('./request');
const { checkOk } = request;

describe.only('Seed data API', () => {

    // beforeEach(() => dropCollection('bars'));
    // beforeEach(() => dropCollection('users'));
    // beforeEach(() => dropCollection('sales'));

    beforeEach(() => {
        execSync('mongoimport -h ds163781.mlab.com:63781 -d heroku_llqdz89v -c users -u heroku_llqdz89v -p o26t22hmm7r2a6g9r53g5adrdf --drop --file lib/data/users-data.json');
        execSync('mongoimport -h ds163781.mlab.com:63781 -d heroku_llqdz89v -c bars -u heroku_llqdz89v -p o26t22hmm7r2a6g9r53g5adrdf --drop --file lib/data/bars-data.json');
        execSync('mongoimport -h ds163781.mlab.com:63781 -d heroku_llqdz89v -c sales -u heroku_llqdz89v -p o26t22hmm7r2a6g9r53g5adrdf --drop --file lib/data/sales-data.json');
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection users --drop --file ${usersDataFile}`);
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection bars  --drop --file ${barsDataFile}`);
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection sales --drop --file ${salesDataFile}`);
    });
    

    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db team_froggy_test --collection users --out users-data.json
    // mongoexport --db team_froggy_test --collection bars --out bars-data.json
    // mongoexport --db team_froggy_test --collection sales --out sales-data.json

    it('Seeds data', () => {

    });
});
