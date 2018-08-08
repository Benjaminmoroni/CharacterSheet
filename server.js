var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var router = require('./app/routes.js');
app.use('/character', router)

app.listen(port)
