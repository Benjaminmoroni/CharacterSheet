
const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const ejs = require("ejs");

exports.myModule = function(req, res) {
  let rawdata = fs.readFileSync("./characters.json");
  let characters = JSON.parse(rawdata);
  if (req.method === "GET") {
    if (req.url === "/character/sheets") {
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
    else if (req.url === "/character/creation") {
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
  }
  else if (req.method === "POST") {
    if (req.url === '/character/create') {
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
                      console.log('Done!')
            })
        });
        res.writeHead(302, {'Location': '/character/sheets'});
        res.end();
      });
    }
    else if (req.url === '/character/update') {
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
                      console.log('Done!')
            })
        });
        res.writeHead(302, {'Location': '/character/sheets'});
        res.end();
      });
    }
    else if (req.url === '/character/delete') {
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
            delete characters[id]

            fs.writeFileSync('./characters.json', JSON.stringify(characters), 'utf-8', function(err) {
                if (err) throw err
                      console.log('Done!')
            })
        });
        res.writeHead(302, {'Location': '/character/sheets'});
        res.end();
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("Not Created - 404 Not Found");
    }
  }
}
