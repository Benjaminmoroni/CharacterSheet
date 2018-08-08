var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var qs = require('querystring')
var shortid = require("shortid")

var router = express.Router();
module.exports = router;

router.get('/creation', function(req, res) {
  res.sendFile(path.join(__dirname, "../charactercreation.html"))
});
router.get('/sheets', function(req, res) {
  let rawdata = fs.readFileSync("./characters.json");
  let characters = JSON.parse(rawdata);
  ejs.renderFile("charactersheet.html", {"characters":characters}, function(err, str){
    res.write (str);
    res.end(

)
  });
})
router.post('/update', function(req, res) {
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function(){
    var formData = qs.parse(body);
    var id = formData.characterId
    fs.readFile('./characters.json', 'utf-8', function(err, data) {
      if (err) throw err
      var characters = JSON.parse(data)
      characters[id] = formData
      fs.writeFileSync('./characters.json', JSON.stringify(characters), 'utf-8', function(err) {
        if (err) throw err
      })
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
    fs.readFile('./characters.json', 'utf-8', function(err, data) {
      if (err) throw err
      var characters = JSON.parse(data)
      characters[newId] = formData
      fs.writeFileSync('./characters.json', JSON.stringify(characters), 'utf-8', function(err) {
        if (err) throw err
      })
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
    fs.readFile('./characters.json', 'utf-8', function(err, data) {
      if (err) throw err;
      var characters = JSON.parse(data);
      delete characters[id];
      fs.writeFileSync('./characters.json', JSON.stringify(characters), 'utf-8', function(err) {
        if (err) throw err
      });
    });
    res.writeHead(302, {'Location': '/character/sheets'});
    res.end();
  });
})
