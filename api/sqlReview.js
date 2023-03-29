// this is for a node.js file that is called from the sql.js file
// this file contains a function sqlReview that is called from the sql.js file
// this function is called prior to sending a sql statement to the database
// the sql statement is in the form of sql server
// this function is used to review the sql statement for security issues 
// if the sql statement is not secure then the function returns false
// if the sql statement is secure then the function returns true
// when it looks for specific strings in the sql statement it is case insensitive
// it should use an array (badStrings) for the strings it is looking for in the statement
// there should not be any duplicated entries in badStrings
// the function will also need to check for sql injection attacks by looking for the following strings:
// '--', ';--', ';', '/**/', '/*!', '*/', '@@', '@', 'char(', 'nchar(', 'varchar(', 'nvarchar(', 'alter(', 'begin', 'cast(', 'convert(', 'create(', 'cursor(', 'declare(', 'delete(', 'drop(', 'end', 'exec(', 'execute(', 'fetch(', 'insert(', 'kill(', 'open(', 'select(', 'sys(', 'sysobjects(', 'syscolumns(', 'table(', 'update(', 'xp_cmdshell(', '/*', '*/', '--'
// the function will also need to check to see if the sql statement is only grabbing data from permitted databases and schemas
// the allowed databases and schemas should be in an array (allowedDatabases) with objects that contain the following:
// {database: 'databaseName', schemas: ['schemaNameOne', 'schemaNameTwo', 'schemaNameThree']'}
// it will import the allowedDatabases from the .env file
// the function is called from the sql.js file as follows:
// if (sqlReview(sql)) { ... }

const dotenv = require('dotenv');
dotenv.config(
    {path: '../.env'}
);

function sqlReview(sql) {
    var badStrings = [
        'drop',
        'delete',
        'truncate',
        'alter',
        'create',
        'insert',
        'update',
        'shutdown',
        'restart',
        'kill',
        'waitfor',
        'reconfigure',
        'exec',
        'execute',
        'xp_',
        'sp_',
        'sys.',
        'sys.',
        'sys.objects',
        'sys.columns',
        'sys.tables',
        'sys.views',
        'sys.schemas',
        'information_schema.',
        'information_schema.',
        'information_schema.tables',
        'information_schema.columns',
        '--',
        ';--',
        ';',
        '/**/',
        '/*!',
        '*/',
        '@@',
        '@',
        'char(',
        'nchar(',
        'varchar(',
        'nvarchar(',
        'alter(',
        'begin',
        'cast(',
        'convert(',
        'create(',
        'cursor(',
        'declare(',
        'delete(',
        'drop(',
        'end',
        'exec(',
        'execute(',
        'fetch(',
        'insert(',
        'kill(',
        'open(',
        'select(',
        'sys(',
        'sysobjects(',
        'syscolumns(',
        'table(',
        'update(',
        'xp_cmdshell(',
        '/*',
        '*/',
        '--'
    ];
    var allowedDatabases = JSON.parse(process.env.ALLOWED_DATABASES);
    var sqlLower = sql.toLowerCase();
    for (var i = 0; i < badStrings.length; i++) {
        if (sqlLower.indexOf(badStrings[i]) > -1) {
            return false;
        }
    }
    var sqlParts = sqlLower.split(' ');
    var database = '';
    var schema = '';
    for (var i = 0; i < sqlParts.length; i++) {
        if (sqlParts[i].indexOf('.') > -1) {
            var parts = sqlParts[i].split('.');
            database = parts[0];
            schema = parts[1];
            break;
        }
    }
    if (database === '' || schema === '') {
        return false;
    } else {
        for (var i = 0; i < allowedDatabases.length; i++) {
            if (allowedDatabases[i].database === database) {
                for (var j = 0; j < allowedDatabases[i].schemas.length; j++) {
                    if (allowedDatabases[i].schemas[j] === schema) {
                        return true;
                    }
                }
            }
        }
        return false;
    } 
}

module.exports = {
    sqlReview: sqlReview
}