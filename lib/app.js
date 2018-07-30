const express = require('express');
const app = express();
const morgan = require('morgan');

// middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const auth = require('./routes/auth');
const bars = require('./routes/bars');
const users = require('./routes/users');
const sales = require('./routes/sales');

app.use('/api/bars', bars);
app.use('/api/users', users);
app.use('/api/sales', sales);
app.use('/api/auth', auth);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});

// error handler (needs to go last)
app.use(handler);

module.exports = app;