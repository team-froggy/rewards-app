require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

connect(MONGODB_URI);

const server = http.createServer(app);
const port = process.env.port || 3000;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('Server jammin\' on', server.address().port);
});