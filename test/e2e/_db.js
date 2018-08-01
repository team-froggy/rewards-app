require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const connect = require('../../lib/util/connect');
connect(MONGODB_URI);
const mongoose = require('mongoose');

after(() => {
    return mongoose.connection.close();
});

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};