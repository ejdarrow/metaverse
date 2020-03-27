

export function drawAsset(gridInstance, assetDetails) {
//	if(assetInView(gridInstance, assetDetails)){
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
//	}

}

var VIEW_ANGLE = 0;

//Whether we draw this or not.
function assetInView(gridInstance, asset) {
	var cameraVector = {
		x: gridInstance.cameraX,
		y: gridInstance.cameraY,
		z: gridInstance.cameraZ,
		perspective: gridInstance.cameraTheta
	};
	
	var normalVectorOfCamera = normalizeCamera(gridInstance);

	var assetCenterVector = {
		x: cameraVector.x - asset.center.x,
		y: cameraVector.y - asset.center.y,
		z: cameraVector.z - asset.center.z
	};

	//Cos(theta) = dot product / product of magnitudes
	
	var relativeAngle = cosOfAngle(normalVectorOfCamera, assetCenterVector);

	return relativeAngle > VIEW_ANGLE;
}

function cosOfAngle(v1, v2) {
	return dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
}

function normalizeCamera(gridInstance) {
	return {
		x: Math.cos(gridInstance.cameraTheta * Math.PI/180),
		y: Math.sin(gridInstance.cameraTheta * Math.PI/180),
		z: 0
	};
}

//Applies to anything with x y z variables
function dotProduct(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function magnitude(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}


function getPositionRelativeToCamera(gridInstance, asset){
	var relPos = {
		x: gridInstance.cameraX - asset.center.x,
		y: gridInstance.cameraY - asset.center.y,
		z: gridInstance.cameraZ - asset.center.z,
		theta: asset.theta - gridInstance.cameraTheta 
	};
	
	var relativeCos = cosOfAngle(normalizeCamera(gridInstance), relPos);
	var relativeSin = Math.sqrt(1 - relativeCos * relativeCos);
	var relativeMagnitude = magnitude(relPos);
	
	var rotatedRelPos = {
		x: relativeMagnitude * relativeSin,
		y: relativeMagnitude * relativeCos,
		z: relPos.z,
		theta: relPos.theta
	};

	return rotatedRelPos;
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
	

	var relativePosition = getPositionRelativeToCamera(gridInstance, planeDetails);

        center.style.transform = "rotateY(" + relativePosition.theta +"deg) " +
                                "rotateX(" + planeDetails.phi + "deg) " +
                                "rotateZ(" + planeDetails.phi + "deg) " +
                                "translateZ(" + relativePosition.y + "px) " +
                                "translateX(" + relativePosition.x + "px) " +
                                "translateY(" + relativePosition.z + "px)";

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

	var relativePosition = getPositionRelativeToCamera(gridInstance, diamondDetails);
	
	center.style.transform = "rotateY(" + relativePosition.theta +"deg) " +
				"rotateX(" + diamondDetails.phi + "deg) " +
				"rotateZ(" + diamondDetails.phi + "deg) " +
				"translateZ(" + relativePosition.y + "px) " +
				"translateX(" + relativePosition.x + "px) " +
				"translateY(" + relativePosition.z + "px)";
			

        
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
	
	var relativePosition = getPositionRelativeToCamera(gridInstance, boxDetails);

        center.style.transform = "rotateY(" + relativePosition.theta +"deg) " +
                                "rotateX(" + boxDetails.phi + "deg) " +
                                "rotateZ(" + boxDetails.phi + "deg) " +
                                "translateZ(" + relativePosition.y + "px) " +
                                "translateX(" + relativePosition.x + "px) " +
                                "translateY(" + relativePosition.z + "px)";

	document.getElementById("cube").appendChild(center);

}
//Write a helper function to simplify dimensions handling
