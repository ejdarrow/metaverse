
//Timer object used between voxel translation calls.
var timer = null;

//Calls the voxel translation function multiple times for the duration that the left mouse button is being held down.
function updateGridOnMouseDown(direction){
  timer = setInterval("updateGrid('" + direction + "');", cursorInterval);
}

//As soon as the user lifts up on the left mouse button, the translation timer needs to be reset.
function updateGridOnMouseUp(){
  window.clearInterval(timer);
}


export function drawBox(gridInstance){
	/*
		x -> 
		
		y /

		z ^
	*/	
	var boxDetails = {
			center : {
				x : 100,
				y : 100,
				z : 0
			},
			dimensions : {
				x : 100,
				y : 100,
				z : 100
			},
			color : {
				r : 0,
				g : 0,
				b : 255,
				a : 0.25
			},
			theta : 0, //xy degree
			phi :0    //xz degree
		};
	/**/

	var center = document.createElement('div');
	center.className = "voxel";
	var topFace = document.createElement('div');
	topFace.className = "voxelFace";
	var cssText = "height:" + boxDetails.dimensions.x + "px;";
	cssText += "width:" + boxDetails.dimensions.y + "px;";
	cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
						boxDetails.color.g + ", " +
						boxDetails.color.b + ", " +
						boxDetails.color.a + ");";
	
	cssText += "-webkit-transform: rotateX(90deg) translateZ(" + boxDetails.dimensions.z/2 + "px);";

	topFace.setAttribute("style", cssText);
	
	var frontFace = document.createElement('div');
	frontFace.className = "voxelFace";
	cssText = "height:" + boxDetails.dimensions.z + "px;";
	cssText += "width:" + boxDetails.dimensions.x + "px;";
	cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
                                                boxDetails.color.g + ", " +
                                                boxDetails.color.b + ", " +
                                                boxDetails.color.a + ");";
	cssText += "-webkit-transform: translateZ(" + boxDetails.dimensions.y/2 + "px);"
	frontFace.setAttribute("style", cssText);
	

	var leftFace = document.createElement('div');
        leftFace.className = "voxelFace";
        cssText = "height:" + boxDetails.dimensions.z + "px;";
        cssText += "width:" + boxDetails.dimensions.y + "px;";
        cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
                                                boxDetails.color.g + ", " +
                                                boxDetails.color.b + ", " +
                                                boxDetails.color.a + ");";
        cssText += "-webkit-transform: rotateY(90deg) translateZ(" + boxDetails.dimensions.x/2 + "px);"
        leftFace.setAttribute("style", cssText);

	var rightFace = document.createElement('div');
        rightFace.className = "voxelFace";
        cssText = "height:" + boxDetails.dimensions.z + "px;";
        cssText += "width:" + boxDetails.dimensions.y + "px;";
        cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
                                                boxDetails.color.g + ", " +
                                                boxDetails.color.b + ", " +
                                                boxDetails.color.a + ");";
        cssText += "-webkit-transform: rotateY(-90deg) translateZ(" + boxDetails.dimensions.x/2 + "px);"
        rightFace.setAttribute("style", cssText);

	var backFace = document.createElement('div');
        backFace.className = "voxelFace";
        cssText = "height:" + boxDetails.dimensions.z + "px;";
        cssText += "width:" + boxDetails.dimensions.x + "px;";
        cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
                                                boxDetails.color.g + ", " +
                                                boxDetails.color.b + ", " +
                                                boxDetails.color.a + ");";
        cssText += "-webkit-transform: translateZ( -" + boxDetails.dimensions.y/2 + "px);"
        backFace.setAttribute("style", cssText);

	var bottomFace = document.createElement('div');
        bottomFace.className = "voxelFace";
        var cssText = "height:" + boxDetails.dimensions.x + "px;";
        cssText += "width:" + boxDetails.dimensions.y + "px;";
        cssText += "background-color:rgba(" + boxDetails.color.r + ", " +
                                                boxDetails.color.g + ", " +
                                                boxDetails.color.b + ", " +
                                                boxDetails.color.a + ");";

        cssText += "-webkit-transform: rotateX(90deg) translateZ(-" + boxDetails.dimensions.z/2 + "px);";

        bottomFace.setAttribute("style", cssText);


	center.appendChild(topFace);
	center.appendChild(frontFace);
	center.appendChild(leftFace);
	center.appendChild(rightFace);
	center.appendChild(backFace);
	center.appendChild(bottomFace);

	center.style.paddingLeft = boxDetails.center.x + "px";
	center.style.paddingTop = boxDetails.center.z + "px";
	center.style.transform = "translateZ(" + boxDetails.center.y + "px) rotateY(" + boxDetails.theta + "deg)  rotateX(" + boxDetails.phi + "deg) rotateZ("+boxDetails.phi + "deg)";
	//Implement rotation by theta and phi	

	document.getElementById("cube").appendChild(center);

}
//Write a helper function to simplify dimensions handling
