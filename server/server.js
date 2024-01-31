require('dotenv').config();             // acces to hidden data

const http = require('http')            // http connection


const app = require('./index');         // callback to index
const server = http.createServer(app);       // create a server alocating app object

server.listen(process.env.SERVER_PORT); // start server at port SERVER_PORT

server.on('listening', () => { console.log('Server running at port ' + process.env.SERVER_PORT); }).on('error', (error) => { console.log('Error starting server\n' + error); });