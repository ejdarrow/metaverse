import {GridInstance} from './gridInstance.js';

let gridInstance = new GridInstance();

export {gridInstance};

//Finds the center point of the browser window.
var originX = document.body.offsetWidth / 2;
var originY = document.body.offsetHeight / 2;

//Determines the amount of degrees the cube will rotate upon calling the rotateByMouse() function.
var xThetaMultiplier = 10;
var yThetaMultiplier = 10;

//Sets up the grid's face dimensions
//NOTE: The following sets the grid's CSS with concatenated JavaScript strings.
//      Setting the CSS with a JavaScript style property is desired, but I have not had any luck setting the webkit transform property.
//      The concatenation method works across all browsers regardless.

var grid = document.getElementById("cube");

grid.style.height = gridInstance.cubeDimension + "px";

grid.style.width = gridInstance.cubeDimension + "px";

class TransformedGridFace {

	constructor(gridInstance, faceNum) {
		this.height = gridInstance.cubeDimension;
		this.width = gridInstance.cubeDimension;
		switch (faceNum) {
			case 1: 
				this.transform = "rotateX(90deg) translateZ(" + gridInstance.cubeSideDimension + "px)";
				break;
			case 2:
				this.transform = "translateZ("+ gridInstance.cubeSideDimension + "px)";
				break;
			case 3:
				this.transform = "rotateY(90deg) translateZ(" + gridInstance.cubeSideDimension + "px)";
				break;
			case 4:
				this.transform = "rotateY(180deg) translateZ(" + gridInstance.cubeSideDimension + "px)";
				break;
			case 5:
				this.transform = "rotateY(-90deg) translateZ(" + gridInstance.cubeSideDimension + "px)";
				break;
			case 6:
				this.transform = "rotateX(-90deg) rotate(180deg) translateZ(" + gridInstance.cubeSideDimension + "px)";
				break;
		}
	}
	toCssString() {
		let cssText = "height: " + this.height + "px;";
		cssText += "width: " + this.width + "px;";
		cssText += "-webkit-transform: "+ this.transform + ";";
		cssText += "-moz-transform: " + this.transform + ";";
		cssText += "transform: " + this.transform + ";";
		return cssText;
	}
}

document.getElementById("face1").setAttribute('style', new TransformedGridFace(gridInstance, 1).toCssString());

document.getElementById("face2").setAttribute('style', new TransformedGridFace(gridInstance, 2).toCssString());


document.getElementById("face3").setAttribute('style', new TransformedGridFace(gridInstance, 3).toCssString());


document.getElementById("face4").setAttribute('style', new TransformedGridFace(gridInstance, 4).toCssString());


document.getElementById("face5").setAttribute('style', new TransformedGridFace(gridInstance, 5).toCssString());


document.getElementById("face6").setAttribute('style', new TransformedGridFace(gridInstance, 6).toCssString());



//A normalized vector has a magnitude of 1 and can point in any direction on a plane.
//Mouse coordinates are fed into the parameters as X and Y values, 
//and their vector magnitude is found after performing the Pythagorean theorem on each coordinate.
//After the magnitude is calculated, a normalized heading is returned for the specified coordinate.
function normalize(coordinate, x, y){
	var magnitude = (x * x) + (y * y);
	magnitude = Math.sqrt(magnitude);
	var normalized = 0.00;

	if(coordinate == "x"){
		var normalized = x / magnitude;	
	}
	else{
		var normalized = y / magnitude;	
	}
	return normalized;
}

export function moveByMouse(event) {
	var increment = 5;
	gridInstance.cameraZ += increment * Math.cos(gridInstance.cameraTheta * Math.PI/180);		
	gridInstance.cameraY += increment * Math.sin(gridInstance.cameraTheta * Math.PI/180);
	
	document.getElementById('cube').style[prop] = "translateZ(" + gridInstance.cameraZ +"px)";

}


//Rotates the cube when a mouse event is fired.
export function rotateByMouse(event) {
	//Gets the x and y coordinates of the mouse.
	var x = event.clientX;
	var y = event.clientY;

	//The new x and y coordinates of the mouse relative to the center of the browser window.
	
	gridInstance.relativeX = x - originX;
	gridInstance.relativeY = y - originY;

	//Newly calculated angles used to rotate the cube.
	thetaX += normalize("x", gridInstance.relativeX, gridInstance.relativeY) * xThetaMultiplier;
	thetaY += normalize("y", gridInstance.relativeX, gridInstance.relativeY) * yThetaMultiplier;

	//Updates the CSS to Rotate the cube.
	document.getElementById('cube').style[prop] = "rotateX(" + -thetaY + "deg) rotateY(" + thetaX + "deg)";
}

var u = 100;
var v = 100;
var w = 100;

//A general function for handling key down events.
function keyEvent(event) {
	switch(event.keyCode) {
		case 65: // left
			u--;
			resizePrism(u, v, w);
			break;

		case 87: // up
			v--;
			resizePrism(u, v, w);
			break;

		case 68: // right
			u++;
			resizePrism(u, v, w);
			break;

		case 83: // down
			v++;
			resizePrism(u, v, w);
			break;

		case 69: // in
			w++;
			resizePrism(u, v, w);
			break;

		case 81: // out
			w--;
			resizePrism(u, v, w);
			break;
	};
}

//Rotates the cube 90 degrees in a specified direction.
function rotateOrthogonally(direction){
	if(direction == "left"){
		thetaY -= 90;
	}
	else if(direction == "up"){
		thetaX += 90;
	}
	else if(direction == "right"){
		thetaY += 90;
	}
	else{
		thetaX -= 90;
	}

	//Updates the CSS to Rotate the cube.
	document.getElementById('cube').style[prop] = "rotateX(" + thetaX + "deg) rotateY(" + thetaY + "deg)";
}


//This code is required for the CSS transformation to work.
var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '), prop, el = document.createElement('div');
for(var i = 0, l = props.length; i < l; i++) {
	if(typeof el.style[props[i]] !== "undefined") {
		prop = props[i];
		break;
	}
}

//Reset the angles for each coordinate so they may increment again.
var thetaX = 0;
var thetaY = 0;

