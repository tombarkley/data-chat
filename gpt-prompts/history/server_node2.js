// create server file for node.js
// the index.html file will be the front end and is located in the public folder which is at the same level as this files parent folder
// the file should route api call backs from the front end to two different send to two different js files:
// 1. gpt - this will route api calls to the gpt.js file
// 2. sql - this will route api calls to the sql.js file

const express = require('express');
const app = express();
const port = 3000;

// this will allow the server to access the public folder
app.use(express.static('public'));

// this will allow the server to access the gpt.js file
const gpt = require('./gpt.js');

// this will allow the server to access the sql.js file
const sql = require('./sql.js');

// this will allow the server to access the sql.js file
const sql2 = require('./sql2.js');

// this will allow the server to access the sql.js file
const sql3 = require('./sql3.js');

// this will allow the server to access the sql.js file
const sql4 = require('./sql4.js');

// this will allow the server to access the sql.js file
const sql5 = require('./sql5.js');

// this will allow the server to access the sql.js file
const sql6 = require('./sql6.js');

// this will allow the server to access the sql.js file
const sql7 = require('./sql7.js');

// this will allow the server to access the sql.js file
const sql8 = require('./sql8.js');

// this will allow the server to access the sql.js file
const sql9 = require('./sql9.js');

// this will allow the server to access the sql.js file
const sql10 = require('./sql10.js');

// this will allow the server to access the sql.js file
const sql11 = require('./sql11.js');

// this will allow the server to access the sql.js file
const sql12 = require('./sql12.js');

// this will allow the server to access the sql.js file
const sql13 = require('./sql13.js');

// this will allow the server to access the sql.js file
const sql14 = require('./sql14.js');

// this will allow the server to access the sql.js file
const sql15 = require('./sql15.js');

// this will allow the server to access the sql.js file
const sql16 = require('./sql16.js');

// this will allow the server to access the sql.js file
// ended early