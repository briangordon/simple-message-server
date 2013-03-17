http = require "http"
fs = require "fs"

class Message
	constructor: (@text, @clientInfo) ->
		@time = Date.now()

class Server
	# The list of messages which have not yet been taken by a client
	buffer = []

	RESThandler: (req, res) =>
		console.log ("Got " + req.method + " request from " + req.connection.remoteAddress + " for " + req.url)
		switch req.url
			when "/take"
				if req.method is "GET"
					if buffer.length is 0
						console.log "No messages. Sending back 204 No Content"
						res.writeHead 204, "No Content."
						res.end()
					else
						message = (buffer.splice 0,1)[0]
						res.writeHead 200, "OK",
							"Content-Length": Buffer.byteLength message.text
							"Content-Type": "text/plain"
							"Last-Modified": new Date(message.time)
							"From": message.clientInfo.ip
						res.end message.text
				else
					res.writeHead 405, "Method not allowed."
					res.end()

			when "/put"
				if req.method is "POST"
					text = ""
					req.on "data", (chunk) -> (text += chunk.toString())
					req.on "end", -> 
						console.log "Putting data " + text
						clientInfo = 
							ip: req.connection.remoteAddress

						buffer.push(new Message text, clientInfo)
						res.writeHead 200, "Message accepted"
						res.end()
				else
					res.writeHead 405, "Method not allowed."
					res.end()

			when "/"
				# Route for displaying a web form for interacting with the server
				if req.method is "GET"
					fs.readFile "form.html", (err, content) ->
						if err
							res.writeHead 500, "Could not read HTML form from filesystem"
							res.end()
						else
							res.writeHead 200, "OK",
								"Content-Type": "text/html"
							res.end(content)
				else
					res.writeHead 405, "Method not allowed."
					res.end()

			else
				res.writeHead 404, "Valid routes are /take, /put, and /"
				res.end()

s = new Server
port = process.argv[2] || 8080
console.log "Creating server on port " + port
http.createServer(s.RESThandler).listen(port)
console.log "Ready."