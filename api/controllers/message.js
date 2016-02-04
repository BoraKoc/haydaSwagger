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

function createMessage(req, res) {

    var queryValues = { user_name : req.body.userName,
                        user_id : req.body.user_id,
                        text: req.body.message,
                        latitude: req.body.latitude,
                        longitude : req.body.longitude,
                        create_date : new Date() };

    var limitParameters = { user_name : req.body.userName};
    var messageLimitQuery = connection.query('select count(*) as count from haydadb.messages where create_date >= now()-INTERVAL 1 DAY and ?'
                            , limitParameters, function(err, rows, fields){
        if(!err){
            var messageCount = row[0]['count'];
            if(messageCount > 25){
                res.status(500);
                res.json('Too many messages from this user in last 24 hours.');
                return;
            }
        }else{
            res.json('Error while performing message count increase query.');
        }
    });


    var messageQuery = connection.query('insert into haydadb.messages SET ?',queryValues, function(err, rows, fields) {
        if (!err) {
            queryValues = {nickname : req.body.userName};
            var countIncreaseQuery = connection.query('update haydadb.users set message_count = message_count + 1 where ?',queryValues, function(err, rows, fields) {
                if (!err)
                    res.json(req.body.userName + " created a new message");
                else {
                    console.log(countIncreaseQuery.sql);
                    res.json('Error while performing mesage count increase query.');
                }
            });
        }
        else {
            console.log(messageQuery.sql);
            res.json('Error while performing create message query.');
        }
    });
}


function listMessageByRadius(req, res) {

    var values  = {user_id:    req.swagger.params.userId,
                   source:     req.swagger.params.text,
                   latitude:   req.swagger.params.latitude,
                   longitute : req.swagger.params.longitute };
    connection.query( 'CALL haydadb.Get_Message_By_Distance('+req.swagger.params.longitude.value+','+ req.swagger.params.latitude.value+','+req.swagger.params.radius.value+');', function(err, rows, fields){
        if (!err)
            res.json(rows);
        else
            res.json('Error while performing Query.');
    });

}

function listAllMessages(req, res) {

    if(req.swagger.params.userId.value){
        connection.query('select * from haydadb.messages where user_name = ?',req.swagger.params.userId, function(err, rows, fields) {
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

module.exports = {
    listMessageByRadius: listMessageByRadius,
    createMessage: createMessage,
    listAllMessages: listAllMessages
};


