/**
 * Created by eftal on 29.12.2015.
 */

'use strict';
var util = require('util');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    //   host     : "10.240.0.2",
    host : "146.148.112.61",
    user     : "root",
    password : "QU6vfNpx",
    database : 'mysql',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }});

function getVersionInfo(req, res) {
    connection.query('select * from haydadb.version', function(err, rows, fields) {
        if (!err) {
            res.json(rows);
        }
        else
            res.json('Error while performing Query.');
    });
}

module.exports = {
    getVersionInfo: getVersionInfo
};
