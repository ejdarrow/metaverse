// Variables to handle the grid instance
class GridInstance {

	constructor() {

		//Global X, Y, and Z positions of the cursor.
		this.globalCursorX = 0;
		this.globalCursorY = 0;
		this.globalCursorZ = -245;


		this.cameraX = 0;
		this.cameraY = 0;
		this.cameraZ = 0;
		this.cameraTheta = 0; //No looking up for now.

		//Controls the amount of time in milliseconds 
		//between voxel translation function calls.
		this.cursorInterval = 100;

		//The background color used for all voxels.
		this.voxelColor = "cyan";

		//z-index property allows voxels to clip through each other.
		this.zIndexCount = 0;

		//A counter that keeps track of the voxels on screen.
		this.voxelCount = 0;

		//A pointer to the selected voxel, this pointer is 
		//referenced when the user is cycling through voxels.
		this.selectedVoxelPosition = 0;

		//The length, width, and height of a voxel.
		this.cursorXDimension = 100;

		this.cursorYDimension = 100;

		this.cursorZDimension = 100;

		//The length, width, and height of the stage.
		this.cubeDimension = 500;

		//The length, width, and height of the grid's faces.
		this.cubeSideDimension = this.cubeDimension / 2;

		//The default z dimension sets a voxel in the middle of the stage.
		//However, to aid the user, a conventional z dimension is required, that is,
		//set the voxel's start position to the top-left-back of the 3d grid.
		this.correctedZCoordinate = -((this.cubeDimension / 2) - (this.cursorXDimension / 2));
	}

}

export { GridInstance };
