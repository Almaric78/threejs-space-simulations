
var $camera_info = $("#camera_info");
var $select_infos = $("#select_infos");


//Create a function that will construct a solar
//system with three.js using an input data set
var SolarSystem = function(data) {
  this.planet_data = data
  this.tScale = 1000000;
  this.eScale = 1;
};

SolarSystem.prototype.getDistance = function (A, B) {
  return Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2) + Math.pow(A[2] - B[2], 2));
}

SolarSystem.prototype.render3D = function() {

  //Camera, scene, and renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
  scene.add(camera);
  camera.position.set(0,100,500);

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // CONTROLS
  
  //Orbit Controls
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

  var controls = orbitControls
  //controls.update();

  
  var pause = false;
  
  var clock = new THREE.Clock();
  
  
	// KEYBOARD  --- 

	console.time();

	var holdLeft = false,
	    holdRight = false,
	    holdUp = false,
	    holdDown = false,
		holdFront = false,
		holdBack = false;

	window.onkeyup = function (e) {
	    if (e.which == 37) {
	        holdLeft = false;
	    } else if (e.which == 38) {
	        holdUp = false;
	    } else if (e.which == 39) {
	        holdRight = false;
	    } else if (e.which == 40) {
	        holdDown = false;
	    }
	}
  
  
  			// KEY DOWN 
			document.addEventListener("keydown", onDocumentKeyDown, false);
			function onDocumentKeyDown(event) {
				e = event

				var keyCode = event.which;
				// up
				if (keyCode == 87 || keyCode == 38) {
					//cube.position.y += 1;
					// down
					//alert("Up2"); 

				}

				console.log("keyCode=" + keyCode);

				// ECHAP
				if (keyCode == 27) {
					// inverseControls();
					//parameters.FPS_Controls = !controls.enabled
					controls.enabled = !controls.enabled
					//parameters.FPS_Controls
					//GUI_Controls.updateDisplay()
					console.log("New state control " + controls.enabled)

				}
				
				if (keyCode == 49) {
					console.log('FPCAM');
					  var control2FPS = new THREE.FirstPersonControls(camera, renderer.domElement);
					  
					  control2FPS.movementSpeed = 50;
					  control2FPS.lookSpeed = 0.1;
					  controls = control2FPS
  
				}
				
				// SPACE
				else if (keyCode === 32) {
					pause = !pause;
					//e.preventDefault();
					if (pause) console.timeEnd()
					else console.time();
					return false;
				
				} else if (e.which == 37) {
					holdLeft = true;
				} else if (e.which == 38) {
					holdUp = true;
				} else if (e.which == 39) {
					holdRight = true;
				} else if (e.which == 40) {
					holdDown = true;
				}
			}	

	//MOUSE CLICK
	var selection
	
//var onMouseDown = false;


// ONMOUSEMOVE : Permet de changer de curseur sur la Sélection
window.onmousemove = function (e) {

    //if (onMouseDown) onMouseDown.moved = true;

    var vector = new THREE.Vector3(
        +(e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    //projector.unprojectVector( vector, camera );

    vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
		var clickedObj = (intersects[0].object);
		if(clickedObj.mover) {
		//console.log(intersects[0])
			$("body").css("cursor", "pointer");
        /*	
            if (window.event.ctrlKey) {
                    var clickedObj = (intersects[0].object);
                    SelectMeshMover(clickedObj, 'ctlr');
                }
        */
		} else {
			$("body").css("cursor", "default");
		}
    } else {
        $("body").css("cursor", "default");
    }

}
  

  
  
// MOUSE EVENT DOWN / UP

initMouseEvent();

function initMouseEvent() {
		
	var iMobile=0;

    //window.onmousedown = MyMouseDown
    window.addEventListener('mousedown', MyMouseDown, true);

    function MyMouseDown(e) {
        if (e.target.tagName === "CANVAS") {
            onMouseDown = {
                moved: false
            };
        }

        switch (e.button) {
			case 0: // First button ("left")
			
			    //console.log("left");

                var vector = new THREE.Vector3(
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1, 0.5);

                vector.unproject(camera);

                var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

                var intersects = raycaster.intersectObjects(scene.children);
				
				//alert('s')
			
                if (intersects.length > 0) { // SELECTION

                    var clickedObj = (intersects[0].object);
					
					if(clickedObj.mover){
						selection = clickedObj.mover
						console.log("select", clickedObj.mover)
					}
					
				}
			
				if(window.event.shiftKey)
					break;
				
				holdFront = true;
				holdBack = false;
				
				break;

            case 2: // Secondary button ("right")
				holdFront = false;
				holdBack = true;
				
                break;
        } // switch 
    }
	
    // Desactivate Context Menu on Right Clic 
	document.oncontextmenu = new Function("return false");

    window.onmouseup = function (e) {
        if (e.target.tagName === "CANVAS") {
           
            
        }
        onMouseDown = false;
		
		holdFront = false;
		holdBack = false;
    }
}


window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

  
  
  
  
  //Lights
  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .3 );
  scene.add(light);

  var sunLight = new THREE.PointLight(0xffffff);
  sunLight.position.set(0,0,0);
  scene.add(sunLight);

  //Adding the sun
  var sunGeometry = new THREE.SphereGeometry(1, 50, 50);
  var sunMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("../textures/sun_texture.jpg"),
    color: 0xf2e8b7,
    emissive: 0x91917b,
    specular: 0x777d4a,
    shininess: 62,
    envMaps: "refraction"
  });
  var sunObject = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sunObject);

  //Adding a starfield
  var starGeometry = new THREE.SphereGeometry(window.innerHeight, 100, 100);
  var starMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("../images/galaxy_starfield.png"),
    side: THREE.DoubleSide,
    shininess: 5
  });
  var starField = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starField);

  // Scale of the earth, use to get screen coordinates
  // Time scale, and days to seconds conversion
  var eScale = (1 / 510) * 0.00002;
  var secInDay = 87600
  var ctx = this;

  //Initialize and keep track of current angle of planets
  var planets = [];
  this.planet_data.forEach(function (planet) {
    planets.push({
      "name" : planet.name,
      "theta" : 0,
      "dTheta" : (2 * Math.PI) / (planet.period_days * secInDay),
      "diameter" : planet.diameter * eScale * 1000,
      "distance_KM" : planet.distance_KM * eScale,
      "period" : planet.period * this.tScale,
      "inclination" : planet.inclination * (Math.PI / 180),
      "rotation" : (2 * Math.PI) / (planet.rotation_days * secInDay)
    });
  });

  //Draw planetary trajectories in the scene.  These will be fixed
  var trajectories = {};
  planets.forEach(function (planet) {
    
    var targetMaterial = new THREE.LineDashedMaterial({
        color: 0xfffff,
        transparent: true, 
        opacity: .4, 
        dashSize: 5,
        gapSize: 5
    });
    var targetOrbit = new THREE.EllipseCurve(
      0,0,
      planet.distance_KM, planet.distance_KM, 
      0, 2.0 * Math.PI, 
      false);
    var targetPath = new THREE.CurvePath(targetOrbit.getPoints(1000));
    targetPath.add(targetOrbit);
    var targetGeometry = targetPath.createPointsGeometry(100);

    var targetTrajectory = new THREE.Line(targetGeometry, targetMaterial);
    targetTrajectory.rotation.x = Math.PI / 2;
    targetTrajectory.rotation.x += planet.inclination;
    scene.add( targetTrajectory );
    trajectories[planet.name] = targetTrajectory;
  });

  //Create planets and add to the scene
  var planetObjects = {};
  planets.forEach(function (planet) {
    if (planet.name === "pluto") {planet.diameter *= 10}
    var planetGeometry = new THREE.SphereGeometry(planet.diameter, 50, 50);
    var planetMaterial = new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture("../textures/" + planet.name + "_texture.jpg"),
      color: 0xf2f2f2,
      specular: 0xbbbbbb,
      shininess: 2
    });

    var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.x = planet.distance_KM;
    scene.add( planetMesh );
    planetObjects[planet.name] = planetMesh;
	planet.mesh = planetMesh
	planetMesh.mover = planet;
  });
  console.log(planetObjects["earth"].position);

  var t1 = Date.now() / 1000;
  

  var render = function() {
	  
	// MOVE Camera
	var moveSpeed = 4
	
	// DEPLACEMENT 
    var vector = new THREE.Vector3();
    var direction = camera.getWorldDirection(vector);	
	
	if(camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 650){
		if ((holdFront) && camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 20) {
			camera.position.add(vector.multiplyScalar(moveSpeed));
		} else if ((holdBack) && camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 550) {
			camera.position.sub(direction.multiplyScalar(moveSpeed));
		}
	}
	

    // get current time and time difference
    var t2 = Date.now() / 1000;
    var dT = (t2 - t1) * ctx.tScale;
    t1 = t2;

    planets.forEach(function (planet) {
		if(pause) return
		
      planetObjects[planet.name].rotation.y += planet.rotation * 10;
      var dTheta = planet.dTheta * dT; 
      planet.theta += dTheta;
      var phi = planet.inclination * Math.sin(planet.theta);

      if (planet.name === "earth") {
        //console.log(phi, planet.theta);
      }

      //Determine x,y, and z coordinates of planets based off theta + phi
      planetObjects[planet.name].position.z = planet.distance_KM * Math.sin(planet.theta) 
          * ctx.eScale;
      planetObjects[planet.name].position.x = planet.distance_KM * Math.cos(planet.theta) 
          * ctx.eScale;
      planetObjects[planet.name].position.y = - planet.distance_KM * Math.cos((Math.PI / 2) - phi)  * ctx.eScale;
    });
	

	
	
	//var controls, control2FPS
	if(document.getElementById('cbFPC').checked) {
		if(!control2FPS) {
			control2FPS = new THREE.FirstPersonControls(camera, renderer.domElement);
			control2FPS.movementSpeed = 50;
			control2FPS.lookSpeed = 0.1;
		}
		controls = control2FPS
	} else 
		controls = orbitControls
	
	
        // camera 
        if(document.getElementById('cbCam').checked)
            $camera_info.html( LogCam(camera, controls) + LogFPCam(controls) ) ;
        else $camera_info.html('');	
	
        // selection info/debug
        if (selection) {
            $select_infos.html(LogSelection(selection, camera));
            //$select_infos.css('color', "#" + selection.mesh.material.color.getHexString());
        }
		

    renderer.render(scene, camera);
    requestAnimationFrame( render );
	
	//controls.update(clock.getDelta());

  }
  render();


}


var solarSystem = new SolarSystem(planets);
solarSystem.render3D();


//Listen for button click events to change the time scale
$(".timescale button").click(function (event) {
  if (event.target.classList[0] === "increase") {
    solarSystem.tScale *= 2;
  } else {
    solarSystem.tScale *= 0.5;
  }

  //Change timescale display
  $(".timescale span").html(NumToFormat(solarSystem.tScale)); 
});




