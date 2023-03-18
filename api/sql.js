// this is for a node.js file that is called from the server.js file
// this file sends a sql query to the database and returns the results to the server.js file 
// the database is a sql server database
// the sql statement will vary depending on the user's input and is generated in the gpt.js file
// the sql statement is first sent to the front end from the server.js file and then approved by the user and then sent to this file through the server.js file
// the sql statement is then sent to the database and the results are returned to the server.js file in a json object with the following keys:
//  i. headers - an array of headers for the table
//  ii. rows - an array of rows for the table
// the headers and rows will be used to create a table on the front end
// the number of columns and rows will depend on the sql query that is sent to the database
// the sql connection will authenticate through windows authentication

var Connection = require('tedious').Connection;  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
const sqlReview = require('./sqlReview.js');

var config = {  
    userName: '',  
    password: '',  
    server: '',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: '', rowCollectionOnRequestCompletion: true}  
};  

var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected");  
});  

// this function is called from the server.js file
// the sql statement is sent to this function from the server.js file
// the sql statement is then sent to the database and the results are returned to the server.js file in a json object with the following keys:
//  i. headers - an array of headers for the table
//  ii. rows - an array of rows for the table
// the headers and rows will be used to create a table on the front end
// the number of columns and rows will depend on the sql query that is sent to the database
function getData(sql, callback) {
    if (sqlReview(sql)) {
        console.log('sql is good');
    } else {
        console.log('sql is bad');
        callback('sql is bad');
    }
    var request = new Request(sql, function(err, rowCount) {  
        if (err) {  
            console.log(err);
            callback(err);
        } else {  
            console.log(rowCount + ' rows');  
            callback(null, results);
        }  
    });  
    var results = {
        headers: [],
        rows: []
    };
    request.on('columnMetadata', function(columns) {  
        columns.forEach(function(column) {  
            if (results.headers.indexOf(column.colName) === -1) {
                results.headers.push(column.colName);
            }
        });  
    });  
    request.on('row', function(columns) {  
        var row = {};
        columns.forEach(function(column) {  
            row[column.metadata.colName] = column.value;
        });  
        results.rows.push(row);
    });  
    connection.execSql(request);
}

module.exports = {
    getData: getData
};