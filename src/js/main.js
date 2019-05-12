var THREE = require('three');

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

var init = function() {
    // create the scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75,
                    window.innerWidth / window.innerHeight,
                    1, 1000);
    camera.position.z = 20;

    //THIS IS IMPORTANT !!!
    light = new THREE.AmbientLight('0xffffff');
    scene.add(light);

    sceneWrapp();

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

