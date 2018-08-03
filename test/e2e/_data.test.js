const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const barsDataFile = join(__dirname, '../../lib/data/bars-data.json');
const usersDataFile = join(__dirname, '../../lib/data/users-data.json');
const salesDataFile = join(__dirname, '../../lib/data/sales-data.json');

describe.skip('Seed data API', () => {

    beforeEach(() => {
        // execSync('mongoimport -h ds263791.mlab.com:63791 -d heroku_p43lq6vx -c users -u heroku_p43lq6vx -p q7k078nvikkva4bmmk74no52fj --drop --file lib/data/users-data.json');
        // execSync('mongoimport -h ds263791.mlab.com:63791 -d heroku_p43lq6vx -c bars -u heroku_p43lq6vx -p q7k078nvikkva4bmmk74no52fj --drop --file lib/data/bars-data.json');
        // execSync('mongoimport -h ds263791.mlab.com:63791 -d heroku_p43lq6vx -c sales -u heroku_p43lq6vx -p q7k078nvikkva4bmmk74no52fj --drop --file lib/data/sales-data.json');
        execSync(`mongoimport --db ${mongoose.connection.name} --collection users --drop --file ${usersDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection bars --drop --file ${barsDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection sales --drop --file ${salesDataFile}`);
    });
    
    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db team_froggy_test --collection users --out users-data.json
    // mongoexport --db team_froggy_test --collection bars --out bars-data.json
    // mongoexport --db team_froggy_test --collection sales --out sales-data.json

    it('Seeds data', () => {

    });
});
