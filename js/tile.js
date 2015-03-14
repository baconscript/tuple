var switchedTiles = new Array(10);
var anyDown = [];

var Tile = {
	init: function(x, y){
		this.x = x;
		this.y = y;
    this.mesh = this.createMesh();
	},
	update: function() {},
	onCollide: function(ai) {},
	blocksMovement: false,
	blocksOnlyPlayer: false,
	color:0xaaaaaa,
  createMesh: function(){
    var geom = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshPhongMaterial( { color: this.color } );
    var mesh = new THREE.Mesh( geom, material );
    mesh.position.x = this.x;
    mesh.position.y = this.y;
    return mesh;
  }
};

// FLOOR TILE
var FloorTile = function(x, y){
	this.init(x, y);
};
FloorTile.prototype = Object.create(Tile);

// WALL TILE
var WallTile = function(x, y){
	//this.color = 0x777777;
  this.createMesh = function(){
    return new THREE.Object3D();
  };
	this.init(x, y);
	this.blocksMovement = true;
};
WallTile.prototype = Object.create(Tile);

// VICTORY TILE
var VictoryTile = function(x, y){
	this.color = 0xaaffaa; //"rgba(95, 255, 80, 1.0)";	
	this.init(x, y);
};
VictoryTile.prototype = Object.create(Tile);
VictoryTile.prototype.onCollide = function(ai) {
	world.victory();
};

// LAVA TILE (kills player)
var LavaTile = function(x, y){
	this.color = 0xff2200;
	this.init(x, y);
};
LavaTile.prototype = Object.create(Tile);
LavaTile.prototype.onCollide = function(ai) {
	world.death();
};

// SWITCHED TILE (wall that can be on/off)
var SwitchedTile = function(x, y){
	this.color = 0xff8800;
	this.init(x, y);
	this.blocksMovement = true;
};
SwitchedTile.prototype = Object.create(Tile);
SwitchedTile.prototype.onCollide = function(ai) {
	this.touchingAI = true;
	// console.log(ai);
	this.justTouching = true;
}
SwitchedTile.prototype.update = function() {
	if(!this.justTouching)
		this.touchingAI = false;
	this.justTouching = false;
}

// SWITCH TILE (toggles wall)
var SwitchTile = function(x, y, id){
	this.color = 0xffee00;
	this.init(x, y);
	this.switchingId = id;
}
SwitchTile.prototype = Object.create(Tile);
SwitchTile.prototype.onCollide = function(ai) {
	this.down = true;
	anyDown[this.switchingId] = true;
	switchedTiles[this.switchingId].blocksMovement = false;
	switchedTiles[this.switchingId].color = 0xffffff;
}
SwitchTile.prototype.update = function() {
	if(!anyDown[this.switchingId]) {
		if(!switchedTiles[this.switchingId].touchingAI) {
			switchedTiles[this.switchingId].blocksMovement = true;
			switchedTiles[this.switchingId].color = 0x333333;
		}
	}
	anyDown[this.switchingId] = false;
}

// PLAYER WALL TILE (blocks only player)
var PlayerWallTile = function(x, y){
	this.color = 0x88aaff;
	this.init(x, y);
	this.blocksOnlyPlayer = true;
};
PlayerWallTile.prototype = Object.create(Tile);


var getTile = function(x, y, id) {
	if(19<id && id<30) {
		t = new SwitchedTile(x, y)
		switchedTiles[id-20] = t;
		anyDown.push(false);
		return t;
	}
	else if(9<id && id<20) {
		return new SwitchTile(x, y, id-10);
	}
	else {
		switch(id) {
			case 1:
				return new WallTile(x, y);
			case 2:
				return new VictoryTile(x, y);
			case 3:
				return new LavaTile(x, y);
			case 4: 
				return new PlayerWallTile(x, y);
			default:
        if(id !== 0) console.log(x, y, id);
				return new FloorTile(x, y);
		}
	}
}

