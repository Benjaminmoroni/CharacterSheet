var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var qs = require('querystring')
var shortid = require("shortid")

var app = express();
var port = process.env.PORT || 8080;

var router = require('./app/routes.js');
app.use('/character', router)

app.listen(port)

app.get('/', function (req, res) {
  fs.readFile("login.html", function(err, data){
    res.write (data)
    res.end ()
  })
});
