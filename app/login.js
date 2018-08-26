var express = require('express');
var fs = require('fs');
var path = require('path');
var qs = require('querystring')
var shortid = require("shortid")
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "test"
});

var cookieParser = require('cookie-parser'); // module for parsing cookies
var app = express();
app.use(cookieParser());

var router = express.Router();
module.exports = router;

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "../login.html"))
})
router.post('/register', function(req, res){
  var newId = shortid.generate();
  var today = new Date();
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    formData.id = newId
    bcrypt.hash(formData.psw, 10, function(err, hash) {
      let password = hash
      var sql = "INSERT INTO users SET id = ?, first_name = ?, last_name = ?, email = ?, password = ?, created = ?, modified = ?";

      con.query(sql, [formData.id, formData.first_name, formData.last_name, formData.email, password, today, today], function (err, result, fields) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
    res.writeHead(302, {'Location': '/login'});
    res.end();
  })
})
router.post('/login', function(req, res){
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    let email = formData.email2
    let password = formData.psw2
    con.query("SELECT * FROM users WHERE email = ?", [email], function (err, result, fields) {
      if (err) throw err;
      bcrypt.compare(password, result[0].password, function(err, doesMatch){
        if (doesMatch){
          res.cookie('username', result[0].email, { maxAge: 900000, httpOnly: true });
          console.log('Cookie has been set');
          res.writeHead(302, {'Location': '/character/sheets'});
          res.end();
        }
        else{
          res.writeHead(302, {'Location': '/'});
          res.end();
        }
      });
    });
  });
})
