// create server file for node.js
// the file should route api call backs from the front end to two different send to two different js files:
// 1. gpt - this will route api calls to the gpt.js file
// 2. sql - this will route api calls to the sql.js file

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));