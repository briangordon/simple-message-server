simple-message-server
=====================

A RESTful message server written in CoffeeScript.

Usage
-----

This tool is written in CoffeeScript, which compiles to JavaScript. I've included the compiled source as `Server.js`, so you don't really need CoffeeScript if you don't want it. 

1. If you have CoffeeScript: `coffee Server.coffee [port]`
2. If you only have Node: `node Server.js [port]`

`port` is 8080 by default.

To install CoffeeScript, you can run `sudo npm install -g coffee-script`.

What does it do?
----------------

Clients provide plain text messages to the server by POSTing to /put. Messages are dequeued in order by GETing to /take.

Demo client
-----------

Run the server using one of the commands above. Then point your web browser to 127.0.0.1:port/ to get a demo page.