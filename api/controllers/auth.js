/**
 * Created by eftal on 12.01.2016.
 */
var util = require('util');
var jwt = require('jwt-simple');
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
    authenticateUser: authenticateUser
};


function authenticateUser(req, res) {

    var email = req.swagger.params.email.value;
    var password = req.swagger.params.password.value;
    connection.query('select * from haydadb.users where email = ? and password = ?', [email, password], function (err, rows, fields) {
        if (!err && rows.length > 0) {
            var generatedToken = genToken(rows[0].name);
            res.json({token : generatedToken.token.toString(), expires:generatedToken.expires.toString()});
        }
        else {
            res.status(401);
            res.json("Invalid credentials");
        }
    });
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../helpers/secret')());

    return {
        token: token,
        expires: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}







