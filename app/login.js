const express = require('express');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const shortid = require("shortid");
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test"
});

var router = express.Router();
module.exports = router;

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../login.html"))
})
router.post('/register', passport.authenticate('signup', { session : false }) , (req, res, next) => {
  res.writeHead(302, {'Location': '/'});
  res.end();
});
router.post('/login', passport.authenticate('login', {session: false}), (req, res, next) => {
  if(!req.user){
    const error = new Error('An Error occured')
    return next(error);
  }
  const token = jwt.sign({ user : req.user },'top_secret');
  res.cookie('username', token, { maxAge: 900000, httpOnly: true });
  res.writeHead(302, {'Location': '/character/sheets'});
  res.end();
});
router.post('/logout', function(req, res){
  res.clearCookie('username');
  req.logout();
  res.redirect('/');
});
