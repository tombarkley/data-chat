// create server file for node.js
// the index.html file will be the front end and is located in the public folder which is at the same level as this files parent folder
// the file should route api call backs from the front end to two different send to two different js files:
// 1. gpt - this will route api calls to the gpt.js file which has the following functions exported:
// 1.1. chat - this will route a message to various gpt endpoints and return a json object with the response
// 2. sql - this will route api calls to the sql.js file which has the following functions exported:
// 2.1. query - this will get data from the sql database
// the above routed api calls will all return an object back to the front end as well

const express = require('express');
const app = express();
const port = 3000;

// this is the route for the gpt api calls
const gpt = require('./gpt');
app.use('/gpt', gpt);

// this is the route for the sql api calls
const sql = require('./sql');
app.use('/sql', sql);

// this is the route for the front end
app.use(express.static('public'));

// this is the route for the front end
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));