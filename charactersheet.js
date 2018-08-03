const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const ejs = require("ejs")
var shortid = require("shortid")
var character = require('./character.js')
const PORT = process.env.PORT || 8080
const server = http.createServer(function (req, res) {
  if (req.url.startsWith("/character")) {
    character.myModule(req, res)
  }
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
