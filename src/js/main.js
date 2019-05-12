var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
// console.log(OrbitControls);
var scene,
    camera,
    light,
    renderer;

var sceneWrapp = function () {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    var material = new THREE.MeshPhongMaterial({color: 'blue', shininess: 10, side: THREE.DoubleSide, wireframe:true });

    var sceneWrapp = new THREE.Mesh(geometry, material);
    sceneWrapp.rotation.x = Math.PI / 2;
    sceneWrapp.position.y = -100;

    scene.add(sceneWrapp);
}

var sphere = function (radius, horizontalS, verticalS, color, posX, posY, posZ) {
    var geometry = new THREE.SphereGeometry( radius, horizontalS, verticalS);
    var material = new THREE.MeshPhongMaterial({color: color,shininess: 1, wireframe:true});

    var sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );
    sphere.position.set(posX, posY, posZ);
}

var box = function (width, height, depth, color, posX, posY, posZ) {
    var geometry = new THREE.BoxGeometry( width, height, depth);
    var material = new THREE.MeshPhongMaterial({color: color,shininess: 1, wireframe:true});

    var sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );
    sphere.position.set(posX, posY, posZ);
}

var init = function() {
    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    light = new THREE.AmbientLight('0xffffff');
    scene.add(light);

    sceneWrapp();
    sphere(50, 50, 50, 'red', 0, -50, 0);
    box(10, 100, 10, 'green', 100, -50, 0);

    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

};


// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    renderer.render(scene, camera);

    requestAnimationFrame(mainLoop);
};

init();
mainLoop();

