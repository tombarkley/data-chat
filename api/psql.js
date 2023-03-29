// this is for a node.js file that is called from the server.js file
// this file sends a sql query to the database and returns the results to the server.js file 
// the database is a postgres sql database
// the sql statement will vary depending on the user's input and is generated in the gpt.js file
// the sql statement is first sent to the front end from the server.js file and then approved by the user and then sent to this file through the server.js file
// the sql statement is then sent to the database and the results are returned to the server.js file in a json object with the following keys:
//  i. headers - an array of headers for the table
//  ii. rows - an array of rows for the table
// the headers and rows will be used to create a table on the front end
// the number of columns and rows will depend on the sql query that is sent to the database
// the sql query will be sent to the database through the pg module

const { Pool, Client } = require("pg");
const url = require("url");
const dotenv = require('dotenv');
dotenv.config(
    {path: '../.env'}
);
const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({ connectionString: connectionString,  });
const pool = new Pool({ user: 'dbuser',
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
});

// const connectionString = "postgres://rifityvwpdybon:ec03d386c76b50e8a10c9fcaf52daa83af39a2f8cbb50e7537e58f3a594758a8@ec2-54-225-74-178.compute-1.amazonaws.com:5432/dajfu8enniu8c9";
// const pool = new Client({ connectionString: connectionString });
const client = new Client();

// when a user sends a get request to this file, the callback function is run
// this sends a sql query to the database and returns the results to the server.js file
const runQuery = async (request) => {
    var params = [];
    let jsonObj = {};
    // console.log(callback)
    // get a postgres client from the connection pool
    // pool.connect(function(err, client, done) {
    //     // handle connection errors
    //     if (err) {
    //         done();
    //         console.log(err);
    //         jsonObj = { error: err };
    //         return err;
    //     }
    // });
    const pquery = await pool.query(request)
    .then(res => {
        var data = [];
        var headers = [];
        for (var key in res.fields) {
            headers.push(res.fields[key]["name"]);
        }
        for (var row in res.rows) {
            let new_row = [];
            for (var hdr in headers) {
                new_row.push(res.rows[row][headers[hdr]]);
            }
            data.push(new_row)
        }
        jsonObj = { headers: headers, rows: data };
        // console.log(jsonObj)
        return jsonObj;
    })
    .catch(err => {
        console.log(err);
        jsonObj = { error: err };
        return jsonObj;
    });
    // console.log(pquery)
    return pquery;
}

module.exports.runQuery = runQuery;