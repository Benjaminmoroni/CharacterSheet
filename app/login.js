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
con.connect(function(err) {
  if (err) throw err;
});

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
    res.writeHead(302, {'Location': '/character/sheets'});
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
    console.log("password from form: "+formData.psw2)
    let email = formData.email2
    bcrypt.hash(formData.psw2, 10, function(err, hash) {
      let password = hash
      console.log(password)
      con.query("SELECT password FROM users WHERE email = ?", [email], function (err, result, fields) {
        if (err) throw err;
        console.log(result)
        bcrypt.compare(formData.psw2, result, function(err, doesMatch){
          if (doesMatch){
            res.send({
               "code":200,
               "success":"login sucessfull"
            });
          }
          else{
            res.send({
               "code":204,
               "success":"Email and password does not match"
            });
          }
        });
      });
    });
  });
})
