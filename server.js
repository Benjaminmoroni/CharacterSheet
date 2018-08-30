var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var shortid = require("shortid");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var mysql = require('mysql');

var app = express();
var port = process.env.PORT || 8080;

var router = require('./app/routes.js');
var login = require('./app/login.js');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test"
});
con.connect(function(err) {
  if (err) throw err;
});

app.use(cookieParser());
app.get('/', function (req, res) {
  res.writeHead(302, {'Location': '/login'});
  res.end();
});
app.use('/login', login)
app.use(function(req, res, next){
  var username = req.cookies['username'];
  if (username) {
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(username, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    console.log(mystr);
    next();
  } else {
  console.log('no cookie found')
  res.writeHead(302, {'Location': '/login'});
  res.end();
  }
})
app.use('/character', router)

app.listen(port)
