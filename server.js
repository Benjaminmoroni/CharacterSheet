var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var qs = require('querystring')
var shortid = require("shortid")
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

var router = require('./app/routes.js');
var login = require('./app/login.js');

app.use('/character', router)
app.use('/login', login)

app.listen(port)
