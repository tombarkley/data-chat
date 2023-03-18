// create server.js file for node.js
// the index.html file will be the front end and is located in the public folder which is at the same level as this files parent folder
// the index.html file is what will be returned to the user when they go to the website
// additionally the server.js file should route api call backs from the front end to two different send to two different js files:
// 1. gpt - this will route api calls to the gpt.js file which has the following functions exported:
// 1.1. chat - this will route a message to various gpt endpoints and return a json object with the response
// 2. sql - this will route api calls to the sql.js file which has the following functions exported:
// 2.1. query - this will get data from the sql database
// the above routed api calls will all return an object back to the front end as well

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const gpt = require('./gpt.js');
const sql = require('./sql.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.post('/api/gpt', (req, res) => {
  console.log(req.body);
  gpt.gptIn(req.body).then(function(result) {
    res.send(result);
  });
});

app.post('/api/sql', (req, res) => {
  console.log(req.body);
  sql.getData(req.body).then(function(result) {
    res.send(result);
  });
//   res.send(result);
});

app.listen(port, () => console.log(`Listening on port ${port}`));