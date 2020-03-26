import {drawBox} from '/rad/js/voxel.js';
import {gridInstance, updateCamera} from '/rad/js/stage.js';

$(function() {
	var FADE_TIME = 150; //ms
	var TYPING_TIMER_LENGTH = 400; //ms
	var COLORS = [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	];
	
	//Initialize shit
	var $window = $(window);
	var $usernameInput = $('.usernameInput');
	var $messages = $('.messages');
	var $inputMessage = $('.inputMessage');
	
	//Location
	var xLoc = 50.0; //floats
	var yLoc = 50.0; 
	var zLoc = 0.0; //Fixed for now 
	var directionXY = 0.0; //Expressed in degrees.
	var directionI = 0.0; // Looking up/down

	var $loginPage = $('.login.page');
	var $chatPage = $('.chat.page');

	//Prompt for setting username
	var username;
	var connected = false;
	var dialogState = false;
	var typing = false;
	var lastTypingTime;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	const addParticipantsMessage = (data) => {
		var message = '';
		if(data.numUsers == 1){
			message += "there's 1 participant";
		} else {
			message += "there are " + data.numUsers + " participants";
		}
		log(message);
	}

	const setUsername = () => {
		username = cleanInput($usernameInput.val().trim());
		
		if(username) {
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off('click');
			$currentInput = $inputMessage.focus();

			socket.emit('add user', username);
			sendMove();
		}
	}
	
	
	const sendMessage = () => {
		var message = $inputMessage.val();
		
		message = cleanInput(message);
		
		if(message && connected){
			$inputMessage.val('');
			addChatMessage({
				username: username,
				message: message
			});
			socket.emit('new message', message);
		}
	}


	const log = (message, options) => {
		var $el = $('<li>').addClass('log').text(message);
		addMessageElement($el, options);
	}

	
	const addChatMessage = (data, options) => {
		var $typingMessages = getTypingMessages(data);
		options = options || {};
		if($typingMessages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}

		var $usernameDiv = $('<span class="username"/>')
			.text(data.username)
			.css('color', getUsernameColor(data.username));
		var $messageBodyDiv = $('<span class="messageBody">')
			.text(data.message);

		var typingClass = data.typing ? 'typing' : '';
		var $messageDiv = $('<li class="message"/>')
			.data('username', data.username)
			.addClass(typingClass)
			.append($usernameDiv, $messageBodyDiv);

		addMessageElement($messageDiv, options);
	}

	const addChatTyping = (data) => {
		data.typing = true;
		data.message = 'is typing';
		addChatMessage(data);
	}

	const removeChatTyping = (data) => {
		getTypingMessages(data).fadeOut(function() {
			$(this).remove();
		});
	}

	const addMessageElement = (el, options) => {
		var $el = $(el);

		if(!options) {
			options = {};
		}
		if(typeof options.fade === 'undefined') {
			options.fade = true;
		}
		if(typeof options.prepend === 'undefined') {
			options.prepend = false;
		}
		
		if(options.fade) {
			$el.hide().fadeIn(FADE_TIME);
		}
		if(options.prepend) {
			$messages.prepend($el);
		} else {
			$messages.append($el);
		}
		$messages[0].scrollTop = $messages[0].scrollHeight;
	}

	const cleanInput = (input) => { //Sanitize for markup
		return $('<div/>').text(input).html();
	}


	const updateTyping = () => {
		if(connected) {
			if(!typing) {
				typing = true;
				socket.emit('typing');
			}
			lastTypingTime = (new Date()).getTime();
			
			setTimeout(() => {
				var typingTimer = (new Date()).getTime();
				var timeDiff = typingTimer - lastTypingTime;
				if(timeDiff >= TYPING_TIMER_LENGTH && typing) {
					socket.emit('stop typing');
					typing = false;
				}
			}, TYPING_TIMER_LENGTH);
		}
	}

	const getTypingMessages = (data) => {
		return $('.typing.message').filter(function(i) {
			return $(this).data('username') === data.username;
		});
	}

	const getUsernameColor = (username) => {
		var hash = 7;
		for (var i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + (hash << 5) - hash;
		}
		var index = Math.abs(hash % COLORS.length);
		return COLORS[index];
	}


	//Movement

	var TURN_ANGLE = 5.0;
	var MOVE_INCREMENT = 5; //Add acceleration / Running
	
	const advance = () => {
		var directionXYrad = directionXY * Math.PI / 180.0;
		xLoc += MOVE_INCREMENT * Math.cos(directionXYrad);
		yLoc += MOVE_INCREMENT * Math.sin(directionXYrad);
	}
	
	const turnLeft = () => {
		directionXY -= TURN_ANGLE;
		directionXY = clipDirection(directionXY);
	}

	const turnRight = () => {
		directionXY += TURN_ANGLE;
		directionXY = clipDirection(directionXY);
	}

	const retreat = () => {
		var directionXYrad = directionXY * Math.PI / 180.0;
		xLoc -= MOVE_INCREMENT * Math.cos(directionXYrad);
		yLoc -= MOVE_INCREMENT * Math.sin(directionXYrad);
	}


	const clipDirection = (direction) => {
		if(direction >= 360.0){
                        return direction - 360.0;
                } else if(direction < 0){
                        return 360.0 + direction;
                } else {
			return direction;
		}
	}

	const logLocation = () => {
		log(username + ": x=" + xLoc + ", y=" + yLoc + ", theta=" + directionXY);
	}

	//Draw logic
	
        //Assets is an array of objects with x y theta coords plus color. Will be expanded.

	const drawFrame = (assets) => {
		var demoAssets = [{
			id: "demoAvatar",
			center: {
				x: 100,
				y: 100,
				z: 0
			},
			dimensions: {
				x: 100,
				y: 100,
				z: 100
			},
			color: {
				r: 0,
				g: 0,
				b: 255,
				a: 0.25
			},
			theta: 0,
			phi : 0
		}];

		assets.forEach( asset => {
			if(asset.id != username + "_avatar") { // not me
				$("#" + asset.id ).remove();
				drawBox(gridInstance, asset);
			} else { // me
				gridInstance.cameraX = asset.center.x;
				gridInstance.cameraY = asset.center.y;
				gridInstance.cameraZ = asset.center.z;
				gridInstance.cameraTheta = asset.theta;	
				updateCamera();
			}
		});
	
	}


       /*
	 const drawFrame = (assets) => {
		var space = document.getElementById("space");
                var drawContext = space.getContext("2d");
		//Debug mode:
		// assets = [ { x: xLoc + 50.0, y: yLoc + 50.0, theta: directionXY, color: "#e21400"}];
                //Clear
                drawContext.clearRect(0, 0, space.width, space.height);

                assets.forEach(asset => {


                        var midpoint = getTipPoint(asset);
                        var endpoint = getTipPoint(midpoint);
	                 //Draw a pointer
                        drawContext.beginPath();
                        drawContext.lineWidth = "3";
                        drawContext.strokeStyle = asset.color;
                        drawContext.moveTo(asset.x, asset.y);
                        drawContext.lineTo(midpoint.x, midpoint.y);
                        drawContext.stroke();

                        drawContext.beginPath();
                        drawContext.lineWidth = "1";
                        drawContext.strokeStyle = asset.color;
                        drawContext.moveTo(midpoint.x, midpoint.y);
                        drawContext.lineTo(endpoint.x, endpoint.y);
                        drawContext.stroke();
                });
        }
*/

	
        var TIP_LENGTH = 5.0;

        const getTipPoint = (ray) => {
                thetaRad = ray.theta * Math.PI / 180.0;
                tip = {
                        x : ray.x + Math.cos(thetaRad) * TIP_LENGTH,
                        y : ray.y + Math.sin(thetaRad) * TIP_LENGTH,
                        theta : ray.theta
                };
                return tip;
        }

	const sendMove = () => {
		var locationData = {
			id: username + "_avatar",
			center: {
				x: xLoc,
				y: yLoc,
				z: zLoc
			},
			dimensions: {
				x: 100,
				y: 100,
				z: 100
			},
			color: {
				r: 0,
				g: 0,
				b: 255,
				a: 0.25
			},
			theta: directionXY,
			phi: directionI
		};
		/*
		var locationData = {
			x: xLoc,
			y: yLoc,
			z: zLoc,
			theta: directionXY,
			phi: directionI,
			color: getUsernameColor(username)
		};
		*/
		socket.emit("move", locationData);
	}

	//Keyboard events

	$window.keydown(event => {
		if(!dialogState && username) { //We are logged in and not dialog
			$currentInput.blur();
			if(event.which === 87 || event.which === 38 ) { // w || up
				advance();
				sendMove();
			} else if(event.which === 65 || event.which === 37) { // a || left
				turnLeft();
				sendMove();
			} else if(event.which === 83 || event.which === 40) { // s || down
				retreat();
				sendMove();
			} else if(event.which === 68 || event.which === 39) { // d || right
				turnRight();
				sendMove();
			}
		}
		if(event.which === 13) { //Pressing enter
			if (username) {
				if(dialogState){
					sendMessage();
					socket.emit('stop typing');
					typing = false;
					$currentInput.blur();
					dialogState = false;
				} else {
					$currentInput.focus()
					dialogState = true;
				}
			} else {
				setUsername();
			}
		}
	});
	
	$inputMessage.on('input', () => {
		updateTyping();
	});


	// Click Events 
	
	$loginPage.click(() => {
		$currentInput.focus();
	});

	$inputMessage.click(() => {
		$inputMessage.focus();
		dialogState = true;
	});


	// Socket events
	socket.on('redraw', (assets) => {
		drawFrame(assets);
	});
	socket.on('kick', (reason) => {
		log("You have been kicked because:");
		switch (reason.reason) {
			case "exists": 
				log("Your username already exists");
				break;
			case "max":
				log("Max users connected");
				break;
			default:
				log("We felt like it");
				break;
		}
		
	});
	socket.on('login', (data) => {
		connected = true;
		
		var message = "Welcome to the Metaverse";
		log(message, {
			prepend: true
		});
		addParticipantsMessage(data);
		$inputMessage.blur();	
	});

	socket.on('new message', (data) => {
		addChatMessage(data);
	});

	socket.on('user joined', (data) => {
		log(data.username + ' joined');
		addParticipantsMessage(data);
	});

	socket.on('user left', (data) => {
		log(data.username + ' left');
		addParticipantsMessage(data);
		removeChatTyping(data);
		$("#" + data.username + "_avatar").remove();
	});

	socket.on('typing', (data) => {
		addChatTyping(data);
	});

	socket.on('stop typing', (data) => {
		removeChatTyping(data);
	});

	socket.on('disconnect', () => {
		log('you have been disconnected');
	});

	socket.on('reconnect', () => {
		log('you have been reconnected');
		if(username) {
			socket.emit('add user', username);
		}
	});
	
	socket.on('reconnected_error', () => {
		log('attempt to reconnect has failed');
	});
});
