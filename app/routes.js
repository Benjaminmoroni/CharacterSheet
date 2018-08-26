var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var qs = require('querystring')
var shortid = require("shortid")
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

router.get('/creation', function(req, res) {
  res.sendFile(path.join(__dirname, "../charactercreation.html"))
});
router.get('/sheets', function(req, res) {
  var username = req.cookies['username'];
  if (username) {
    console.log(username)
    con.query("SELECT id FROM users WHERE email = ?", [username], function (err,result,fields) {
      if (err) throw err;
      con.query("SELECT * FROM characters WHERE user_id = ?", [result[0].id], function (err, result, fields) {
        if (err) throw err;
        let characters = result
        ejs.renderFile("charactersheet.html", {"characters":characters}, function(err, str){
          res.write (str);
          res.end()
        });
      });
    })

  } else {
    console.log('no cookie found')
    return res.writeHead(302, {'Location': '/'});
    res.end();
  }
})
router.post('/update', function(req, res) {
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    var id = formData.characterId
    var sql = "UPDATE characters SET CharacterName = ?, Race = ?, Class = ?, Strength = ?, Dexterity = ?, Constitution = ?, Wisdom = ?, Intelligence = ?, Charisma = ? WHERE CharacterId = ?";

    con.query(sql, [formData.CharacterName, formData.Race, formData.Class, formData.Strength, formData.Dexterity, formData.Constitution, formData.Wisdom, formData.Intelligence, formData.Charisma, formData.characterId], function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
    res.writeHead(302, {'Location': '/character/sheets'});
    res.end();
  });
})
router.post('/create', function(req, res) {
  var newId = shortid.generate();
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    formData.id = newId
    var sql = "INSERT INTO characters SET CharacterId = ?, CharacterName = ?, Race = ?, Class = ?, Strength = ?, Dexterity = ?, Constitution = ?, Wisdom = ?, Intelligence = ?, Charisma = ?";
    //var values =
    con.query(sql, [formData.id, formData.CharacterName, formData.Race, formData.Class, formData.Strength, formData.Dexterity, formData.Constitution, formData.Wisdom, formData.Intelligence, formData.Charisma], function (err, result, fields) {
      if (err) throw err;
      console.log("1 record inserted");
    });
    res.writeHead(302, {'Location': '/character/sheets'});
    res.end();
  });
})
router.post('/delete', function(req, res) {
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    var id = formData.characterId
    console.log(formData.characterId)
    var sql = "DELETE FROM characters WHERE characterId = ?";
    con.query(sql, [formData.characterId], function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted: " + result.affectedRows);
    });
    res.writeHead(302, {'Location': '/character/sheets'});
    res.end();
  });
})
