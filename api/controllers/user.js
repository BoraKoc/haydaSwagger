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

module.exports = {
    getUserList: getUserList,
    createUser: createUser
};

function createUser(req, res) {

    var values  = {nickname: req.body.userName, source: "application", password: req.body.userPassword, email: req.body.userEmail};
     connection.query('insert into haydadb.users SET ?',values, function(err, rows, fields) {
        if (!err)
            res.json(rows);
        else {
            console.log(query.sql);
            res.json('Error while performing Query.');
        }
    });

}



function getUserList(req, res) {

    if(req.swagger.params.userId.value){
        var id = req.swagger.params.userId.value;
        connection.query('select * from haydadb.users where id = ?', id, function(err, rows, fields) {
            if (!err)
                res.json(rows);
            else
                res.json('No user found with given id');
        });
    }

    else if(req.swagger.params.userName.value){
       var name = req.swagger.params.userName.value;


        connection.query( "select * from haydadb.users where nickname like ?", '%' + name + '%', function(err, rows, fields) {
            if (!err)
                res.json(rows);
            else {
                console.log(err);
                res.json('no user found with matching name');
            }
        });
    }

    else{
        connection.query('select * from haydadb.users', function(err, rows, fields) {
            if (!err)
                res.json(rows);
            else
                res.json('Error while performing Query.');
        });
    }

}