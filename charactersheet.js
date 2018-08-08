const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const ejs = require("ejs")
const shortid = require("shortid")
const character = require('./character.js')
const PORT = process.env.PORT || 8080
const server = http.createServer(function(req, res) {
  var pieces = req.url.split('/')
  var controller = pieces[1]
  var action = pieces[2]
//handles all requests for /character through character.js
  if (controller === "character") {
    character[action](req, res)
  }
//allows requests for any html file in the server from a browser
  else if (req.method === "GET") {
    var pathname = url.parse(req.url, true).pathname;
    var filename = "./" + pathname;
    fs.readFile(filename, function(err, data){
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
})
server.listen(PORT);
