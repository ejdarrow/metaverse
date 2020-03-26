
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
export function drawAsset(gridInstance, assetDetails) {
	switch(assetDetails.type) {
		case "cube":
			drawBox(gridInstance, assetDetails);
			break;
		case "diamond":
			drawDiamond(gridInstance, assetDetails);
			break;
		case "plane":
			drawPlane(gridInstance, assetDetails);
			break;
	}

}

//Z dimension ignored
function drawPlane(gridInstance, planeDetails) {
	var center = document.createElement('div');
	center.className = "voxel";
	center.id = planeDetails.id;
	var face = document.createElement('div');
	face.className = "voxelFace";
        var cssText = "height:" + planeDetails.dimensions.x + "px;";
        cssText += "width:" + planeDetails.dimensions.y + "px;";
        cssText += "background-color:rgba(" + planeDetails.color.r + ", " +
                                                planeDetails.color.g + ", " +
                                                planeDetails.color.b + ", " +
                                                planeDetails.color.a + ");";

        cssText += "-webkit-transform: rotateX(90deg);";

        face.setAttribute("style", cssText);
	center.appendChild(face);
	
	center.style.transform = "rotateY(" + planeDetails.theta + "deg)  rotateX(" + planeDetails.phi + "deg) rotateZ("+planeDetails.phi + "deg) translateZ(" + planeDetails.center.y + "px) translateX(" + planeDetails.center.x + "px) translateY(" + planeDetails.center.y + "px)";
        //Implement rotation by theta and phi

        document.getElementById("cube").appendChild(center);
}

//Cube expected, as we can't stretch div on angles
//Thusly, diamonds will be funky.
function drawDiamond(gridInstance, diamondDetails){
	var center = document.createElement('div');
        center.className = "voxel";
        center.id = diamondDetails.id;
	var xyDimension = Math.round(diamondDetails.dimensions.z / Math.sqrt(2));
	

        var xyFace = document.createElement('div');
        xyFace.className = "voxelFace";
        var cssText = "height:" + xyDimension + "px;";
        cssText += "width:" + xyDimension + "px;";
        cssText += "background-color:rgba(" + diamondDetails.color.r + ", " + 
                                                diamondDetails.color.g + ", " +
                                                diamondDetails.color.b + ", " +
                                                diamondDetails.color.a + ");";
        
        cssText += "-webkit-transform: rotateX(90deg) rotateZ(45deg);";
        
        xyFace.setAttribute("style", cssText);
	
	var xzDimension = Math.round(diamondDetails.dimensions.y / Math.sqrt(2));
	var xzFace = document.createElement('div');
	xzFace.className = "voxelFace";
	cssText = "height:" + xzDimension +"px;";
	cssText += "width:" + xzDimension + "px;";
	cssText += "background-color:rgba(" + diamondDetails.color.r + ", " +
                                                diamondDetails.color.g + ", " +
                                                diamondDetails.color.b + ", " +
                                                diamondDetails.color.a + ");";

        cssText += "-webkit-transform: rotateY(90deg) rotateZ(45deg);";
        
        xzFace.setAttribute("style", cssText);

	var yzDimension = Math.round(diamondDetails.dimensions.x / Math.sqrt(2));
	var yzFace = document.createElement('div');
	yzFace.className = "voxelFace";
	cssText = "height:" + yzDimension + "px;";
	cssText += "width:" + yzDimension + "px;";
	cssText += "background-color:rgba(" + diamondDetails.color.r + ", " +
                                                diamondDetails.color.g + ", " +
                                                diamondDetails.color.b + ", " +
                                                diamondDetails.color.a + ");";

        cssText += "-webkit-transform: rotateZ(45deg);";
        
        yzFace.setAttribute("style", cssText);


        center.appendChild(xyFace);
	center.appendChild(xzFace);
	center.appendChild(yzFace);        


        center.style.transform = "rotateY(" + diamondDetails.theta + "deg)  rotateX(" + diamondDetails.phi + "deg) rotateZ("+diamondDetails.phi + "deg) translateZ(" + diamondDetails.center.y + "px) translateX(" + diamondDetails.center.x + "px) translateY(" + diamondDetails.center.y + "px)";
        //Implement rotation by theta and phi
        
        document.getElementById("cube").appendChild(center);
}


function drawBox(gridInstance, boxDetails){
	/*
		x -> 
		
		y /

		z ^
	*/
	/*	
	var boxDetails = {
			id : "name",
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
			phi :0,    //xz degre
			type: "cube"
		};
	*/

	var center = document.createElement('div');
	center.className = "voxel";
	center.id = boxDetails.id;
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
	cssText += "background-color:rgba(" + 255 + ", " +
                                                boxDetails.color.g + ", " +
                                                0  + ", " +
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

	center.style.transform = "rotateY(" + boxDetails.theta + "deg)  rotateX(" + boxDetails.phi + "deg) rotateZ("+boxDetails.phi + "deg) translateZ(" + boxDetails.center.y + "px) translateX(" + boxDetails.center.x + "px) translateY(" + boxDetails.center.y + "px)";
	//Implement rotation by theta and phi	

	document.getElementById("cube").appendChild(center);

}
//Write a helper function to simplify dimensions handling
