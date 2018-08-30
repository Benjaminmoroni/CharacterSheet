const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const ejs = require("ejs");
const shortid = require("shortid")
var crypto = require('crypto');

app.use(cookieParser());
//handles requests for /character/sheets, whether from /character/creation or direct. Displays charactersheet.html rendering characters.json with ejs
exports.sheets = function(req, res) {
  let rawdata = fs.readFileSync("./characters.json");
  let characters = JSON.parse(rawdata);
  if (req.method === "GET") {
    ejs.renderFile("charactersheet.html", {"characters":characters}, function(err, str){
      if (err){
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("No Characters - 404 Not Found");
      }
      if (str){
        res.writeHead(200, {"content-type": "text/html"});
        res.write (str);
        res.end();
      }
    });
  }
}
//handles requests for /character/creation. Displays characterchreatioon.html
exports.creation = function(req, res) {
  fs.readFile("charactercreation.html", function(err, data){
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("No File - 404 Not Found");
    }
    if (data) {
      res.writeHead(200, {"content-type": "text/html"});
      res.write (data)
      return res.end ()
    }
  })
}
//Handles requests for /character/create, which is a form submit from /character/creation (charactercreation.html). Adds form data to characters.json
exports.create = function(req, res) {
  if (req.method === "POST") {
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
  }
  else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("Not Created - 404 Not Found");
  }
}
//Handles requests for /character/update, which is a form submit from /character/sheets (charactersheet.html). Updates characters in characters.json
exports.update = function(req, res) {
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
}
//Handles requests for /character/delete, which is a form submit from /character/sheets (charactersheet.html). Deletes characters in characters.json
exports.delete = function(req, res) {
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
}
