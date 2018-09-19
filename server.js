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
const jwt = require('jsonwebtoken');
require('./passport')

var app = express();


app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
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

app.get('/', function (req, res) {
  res.writeHead(302, {'Location': '/login'});
  res.end();
});
app.use('/login', login)
app.use(function(req, res, next){
  var username = req.cookies['username'];
  if (username) {
    jwt.verify(username, 'top_secret', function(err, decoded){
      if(!err){
        req.user = decoded;
        next()}
      else {throw new Error('something bad happened')}
    })
  } else {
  console.log('no cookie found')
  res.writeHead(302, {'Location': '/login'});
  res.end();
  }
})
app.use('/character', router)

app.listen(port)
