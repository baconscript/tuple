var renderer = function() {
	var canvas;
	var ctx;
	var gridSize;
	var width, height;
	var tipDisplay;
	var hud;
  var scene;
  var renderer;
  var camera;
  var cameraSetUp = false;
  var aiMeshes = [];
  var playerMesh;

	var init = function(containerId, hudId, tipId) {
    container = document.getElementById(containerId);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    canvas = renderer.domElement;
    container.appendChild(canvas);
		tipDisplay = document.getElementById(tipId);
		hud = document.getElementById(hudId);
		width = canvas.width;
		height = canvas.height;
	}

  function mkAiMesh(color){
    return function(ai){
      color = color || 0x88aaff;
      var geom = new THREE.CylinderGeometry(0,0.35, 0.6, 16);
      var mat = new THREE.MeshPhongMaterial({color:color});
      var mesh = new THREE.Mesh(geom, mat);
      mesh.position.x = ai.x;
      mesh.position.y = ai.y;
      mesh.position.z = -1;
      mesh.rotation.x = -Math.PI/2;
      ai.mesh = mesh;
      return mesh;
    }
  }
	var initLevel = function(level, aiEntities, floor) {
		var sizeX = level.sizeX;
		var sizeY = level.sizeY;
		this.gridSize = 1; //width/sizeX<height/sizeY ? width/sizeX : height/sizeY;
    scene = new THREE.Scene();
    scene.scale.y = scene.scale.z =  -1;
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
    directionalLight.position.set(1,2,-3);
    scene.add( directionalLight );

		for (var y = 0; y < floor.length; y++) {
			for (var x = 0; x < floor[y].length; x++) {
        scene.add(floor[y][x].mesh);
			}
		}

    aiMeshes = aiEntities.map(mkAiMesh());
    aiEntities.forEach(function(ai){
      scene.add(ai.mesh);
    });

    playerMesh = mkAiMesh(0x0088ff)(player);
    scene.add(player.mesh);
    if(player.currentAI) {
      mkAiMesh()(player.currentAI);
      scene.add(player.currentAI.mesh);
      player.currentAI.mesh.visible = false;
    }

    if(floor.length && floor[0].length) {
      camera.position.x = floor.length*1.3 + .5;
      camera.position.y = -floor.length*1.3 - .5;
      camera.position.z = floor.length/2;
      if(!cameraSetUp){
        camera.rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI/4);
        camera.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/3);
        cameraSetUp = true;
      }
    }
	}

	var renderText = function(deaths, level, tip) {
		hud.innerHTML = deaths + " Deaths " + " | Level " 
      + (level+1) + " / " + levels.length 
      + " <sup><a style='font-size: 12px; text-decoration: none;' href='#"
      +(level+1)+"'>(link)</a></sup>";
		tipDisplay.innerHTML =  "<em>" + tip + "</em>";
	}

	var draw = function(aiEntities, floor) {
		//iterate through and draw tiles first, then entities
		var gridSize = this.gridSize;
    if(aiEntities && aiEntities.length) aiEntities.forEach(function(ai){
      if(!ai.mesh) mkAiMesh()(ai);
      var mesh = ai.mesh;
      mesh.position.x = ai.x;
      mesh.position.y = ai.y;
      mesh.position.z = -1;
    });
    player.mesh.position.x = player.x;
    player.mesh.position.y = player.y;
    renderer.render(scene, camera);
	}

	var showDialogue = function(info) {
	}

	return {
		init: init,
		initLevel: initLevel,
		renderText: renderText,
		draw: draw,
		gridSize: gridSize,
		showDialogue: showDialogue,
	}
}();

