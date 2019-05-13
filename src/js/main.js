var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
// console.log(OrbitControls);
var scene,
    camera,
    light,
    renderer;

var sceneWrapp = function () {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    var material = new THREE.MeshPhysicalMaterial({color: 'blue', shininess: 100, side: THREE.DoubleSide, wireframe:false });

    var sceneWrapp = new THREE.Mesh(geometry, material);
    sceneWrapp.rotation.x = Math.PI / 2;
    sceneWrapp.position.y = -100;
    scene.add(sceneWrapp);
    sceneWrapp.receiveShadow = true;
}

var sphere = function (radius, horizontalS, verticalS, color, posX, posY, posZ) {
    var geometry = new THREE.SphereGeometry( radius, horizontalS, verticalS);
    var material = new THREE.MeshPhongMaterial({color: color, shininess: 100, wireframe:false});

    var sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    scene.add( sphere );
    sphere.position.set(posX, posY, posZ);
}

var box = function (width, height, depth, color, posX, posY, posZ) {
    var geometry = new THREE.BoxGeometry( width, height, depth, 100, 100, 100);
    var material = new THREE.MeshPhongMaterial({color: color, shininess: 100, wireframe:false});

    var box = new THREE.Mesh( geometry, material );
    box.castShadow = true;
    box.receiveShadow = false;
    scene.add( box );
    box.position.set(posX, posY, posZ);
}

var init = function() {
    // create the scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75,
                    window.innerWidth / window.innerHeight,
                    1, 1000);
    camera.position.z = 20;
    camera.position.set(0, 8, -200);

    var controls = new OrbitControls( camera );

    //don't allow bellow ground & max distance
    // controls.maxPolarAngle = Math.PI/2;
    controls.maxDistance = 400;

    //THIS IS IMPORTANT !!!

    // light = new THREE.HemisphereLight('0xffffff');
    // scene.add(light);

    var directionalLight = new THREE.DirectionalLight( 'cyan', 1 );
    directionalLight.position.set( -100, -500, 500 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    var spotLightRight = new THREE.SpotLight( 'grey', 2);
    spotLightRight.position.set( -200, 250, -500 );
    spotLightRight.target.position.set( 0, 0, 0 );
    spotLightRight.castShadow = true;
    spotLightRight.shadow.camera.near = 10; // default
    spotLightRight.shadow.camera.far = 100; // default
    scene.add( spotLightRight.target );
    scene.add( spotLightRight );

    var spotLightLeft = new THREE.SpotLight( 'red', 1);
    spotLightLeft.position.set( 200, 200, 200 );
    spotLightLeft.target.position.set( 100, -50, 0 );
    spotLightLeft.castShadow = true;
    spotLightLeft.shadow.camera.near = 10; // default
    spotLightLeft.shadow.camera.far = 100; // default
    scene.add( spotLightLeft.target );
    scene.add( spotLightLeft );

    sceneWrapp();
    sphere(50, 50, 50, 'yellow', 0, -50, 0);
    box(10, 100, 10, 'green', 100, -50, 0);
    spotLightLeft.shadowCameraVisible = true;
    spotLightRight.shadowCameraVisible = true;
    directionalLight.shadowCameraVisible = true;
    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.body.appendChild(renderer.domElement);

};


// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    renderer.render(scene, camera);

    requestAnimationFrame(mainLoop);
};

init();
mainLoop();

