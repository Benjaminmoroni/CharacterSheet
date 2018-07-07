const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const ejs = require("ejs")
var shortid = require("shortid")
const server = http.createServer(function (req, res) {
  if (req.method === "GET") {
    if (req.url === "/character") {
      let rawdata = fs.readFileSync("./characters.json");
      let character = JSON.parse(rawdata);
      ejs.renderFile("charactersheet.html", character, function(err, str){
        if (err){
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        }
        if (str){
          res.writeHead(200, {"content-type": "text/html"});
          res.write (str);
          res.end();
        }
      });
    } else {
      var pathname = url.parse(req.url, true).pathname;
      var filename = "./" + pathname;
      fs.readFileSync(filename, function(err, data){
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
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
    if (req.url === '/createCharacter') {
      var newId = shortid.generate();
      var body = "";
      req.on("data", function (chunk) {
        body += chunk;
      });

      req.on("end", function(){
        var formData = qs.parse(body);
        formData.id = newId
        var name = qs.parse(body).CharacterName
        fs.readFile('./characters.json', 'utf-8', function(err, data) {
            if (err) throw err

            var arrayOfObjects = JSON.parse(data)
            arrayOfObjects.characters.push(formData)
            arrayOfObjects.names.push(name)

            fs.writeFileSync('./characters.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                if (err) throw err
                      console.log('Done!')
            })
        });
        res.writeHead(302, {'Location': '/character'});
        res.end();
      });
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
  }
})
server.listen(8080);
