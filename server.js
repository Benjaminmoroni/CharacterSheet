const express = require('express');
const session = require('express-session');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const shortid = require("shortid");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const passport = require('passport');

var app = express();


app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

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
