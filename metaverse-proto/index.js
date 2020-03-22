var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// The server plumbing

http.listen(port, () => {
	console.log("Server listening on %d", port);
});


//Routing

app.use(express.static(path.join(__dirname, 'public')));


// Sockets
//TODO: Implement max room size

var numUsers = 0;
var locations = {};

io.on('connection', function(socket){
	var addedUser = false;
	
	socket.on('move', (data) => {
		data["username"] = socket.username;
		locations[socket.username] = data;
		
		io.emit('redraw', Object.values(locations));
	});

	
	socket.on('add user', (username) => {
		socket.username = username;
		++numUsers;		
		addedUser = true;

		//Here will go the max room size logic

		socket.emit('login', {
			numUsers: numUsers
		});

		socket.broadcast.emit('user joined', {
			username: socket.username,
			numUsers: numUsers
		});
	});
	
	socket.on('typing', () => {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});

	socket.on('stop typing', () => {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});


	socket.on('disconnect', () => {
		if(addedUser){
			--numUsers;
		}
		
		socket.broadcast.emit('user left', {
			username : socket.username,
			numUsers : numUsers
		});
	});


	socket.on('new message', function(msg){
		socket.broadcast.emit('new message', {
			username : socket.username,
			message : msg
		});
	});
});

