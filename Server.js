// Generated by CoffeeScript 1.6.1
(function() {
  var Message, Server, fs, http, port, s,
    _this = this;

  http = require("http");

  fs = require("fs");

  Message = (function() {

    function Message(text, clientInfo) {
      this.text = text;
      this.clientInfo = clientInfo;
      this.time = Date.now();
    }

    return Message;

  })();

  Server = (function() {
    var buffer;

    function Server() {
      var _this = this;
      this.RESThandler = function(req, res) {
        return Server.prototype.RESThandler.apply(_this, arguments);
      };
    }

    buffer = [];

    Server.prototype.RESThandler = function(req, res) {
      var message, text;
      console.log("Got " + req.method + " request from " + req.connection.remoteAddress + " for " + req.url);
      switch (req.url) {
        case "/take":
          if (req.method === "GET") {
            if (buffer.length === 0) {
              console.log("No messages. Sending back 204 No Content");
              res.writeHead(204, "No Content.");
              return res.end();
            } else {
              message = (buffer.splice(0, 1))[0];
              res.writeHead(200, "OK", {
                "Content-Length": Buffer.byteLength(message.text),
                "Content-Type": "text/plain",
                "Last-Modified": new Date(message.time),
                "From": message.clientInfo.ip
              });
              return res.end(message.text);
            }
          } else {
            res.writeHead(405, "Method not allowed.");
            return res.end();
          }
          break;
        case "/put":
          if (req.method === "POST") {
            text = "";
            req.on("data", function(chunk) {
              return text += chunk.toString();
            });
            return req.on("end", function() {
              var clientInfo;
              console.log("Putting data " + text);
              clientInfo = {
                ip: req.connection.remoteAddress
              };
              buffer.push(new Message(text, clientInfo));
              res.writeHead(200, "Message accepted");
              return res.end();
            });
          } else {
            res.writeHead(405, "Method not allowed.");
            return res.end();
          }
          break;
        case "/":
          if (req.method === "GET") {
            return fs.readFile("form.html", function(err, content) {
              if (err) {
                res.writeHead(500, "Could not read HTML form from filesystem");
                return res.end();
              } else {
                res.writeHead(200, "OK", {
                  "Content-Type": "text/html"
                });
                return res.end(content);
              }
            });
          } else {
            res.writeHead(405, "Method not allowed.");
            return res.end();
          }
          break;
        default:
          res.writeHead(404, "Valid routes are /take, /put, and /");
          return res.end();
      }
    };

    return Server;

  })();

  s = new Server;

  port = process.argv[2] || 8080;

  console.log("Creating server on port " + port);

  http.createServer(s.RESThandler).listen(port);

  console.log("Ready.");

}).call(this);
