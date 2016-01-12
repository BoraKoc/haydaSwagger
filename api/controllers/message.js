/**
 * Created by eftal on 30.12.2015.
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

module.exports = {
    listMessageByRadius: listMessageByRadius,
    createMessage: createMessage,
    listAllMessages: listAllMessages
};

function createMessage(req, res) {

    var values  = {user_id: req.body.userId, text: req.body.message, latitude: req.body.latitude, longitute : req.body.longitute };

    var query = connection.query('insert into haydadb.messages SET ?',values, function(err, rows, fields) {
        if (!err)
            res.json(rows);
        else {
            console.log(query.sql);
            res.json('Error while performing Query.');
        }
    });

}


function listMessageByRadius(req, res) {

    var values  = {user_id: req.swagger.params.userId, source: req.swagger.params.text, latitude: req.swagger.params.latitude, longitute : req.swagger.params.longitute };
    connection.query( 'CALL haydadb.Get_Message_By_Distance('+req.params.longitude+','+ req.params.latitude+','+req.params.distance+');', function(err, rows, fields){
        if (!err)
            res.json(rows);
        else
            res.json('Error while performing Query.');
    });

}

function listAllMessages(req, res) {

    if(req.swagger.params.userId.value){
        connection.query('select * from haydadb.messages where user_id = ?',req.swagger.params.userId, function(err, rows, fields) {
            if (!err)
                res.json(rows);
            else
                res.json('Error while performing Query with userId.');
        });
    }else{
        connection.query('select * from haydadb.messages', function(err, rows, fields) {
            if (!err)
                res.json(rows);
            else
                res.json('Error while performing Query.');
        });
    }


}



