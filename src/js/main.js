var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
// console.log(OrbitControls);
console.log(objCase)
//Three js
var scene,
    camera,
    light,
    renderer;


//helper functions
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

//Audio API
var file = document.getElementById("audioFile"),
    audio = document.getElementById("audioPlayer"),
    context,
    src,
    analyser,
    bufferLength,
    dataArray;

var onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var sceneWrapp = function () {
    var geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    var material = new THREE.MeshPhysicalMaterial({color: 'blue', shininess: 100, side: THREE.DoubleSide, wireframe:false });

    var sceneWrapp = new THREE.Mesh(geometry, material);
    sceneWrapp.rotation.x = Math.PI / 2;
    sceneWrapp.position.y = 0;
    scene.add(sceneWrapp);
    sceneWrapp.receiveShadow = true;
}

function sphere (radius, horizontalS, verticalS, color) {
    var geometry = new THREE.SphereGeometry( radius, horizontalS, verticalS);
    var material = new THREE.MeshPhongMaterial({color: color, shininess: 100, wireframe:false});

    return new THREE.Mesh( geometry, material );
}

function box (width, height, depth, color) {
    var geometry = new THREE.BoxGeometry( width, height, depth, 100, 100, 100);
    var material = new THREE.MeshPhongMaterial({color: color, shininess: 100, wireframe:false});

    return new THREE.Mesh( geometry, material );
}

var audioAnalyze = function () {

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;

    analyser.getByteFrequencyData(dataArray);
}

var audioHandler = function () {
    document.onload = function(e){
        audio.play();
        init();
    }
    file.onchange = function(){
        var files = this.files;

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        init();
    }

}

var init = function() {

    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    audioAnalyze();

    // create the scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 20;
    camera.position.set(0, 300, -600);

    var controls = new OrbitControls( camera );

    //don't allow bellow ground & max distance
    controls.maxPolarAngle = Math.PI/2;
    controls.maxDistance = 1000;

    //THIS IS IMPORTANT !!!

    light = new THREE.AmbientLight('0xffffff', 0.4);
    scene.add(light);
    var objColor =  Math.random() * 0xff00000 - 0xff00000;
    var directionalLight = new THREE.DirectionalLight( objColor, 1 );
    directionalLight.position.set( 500, 500, 500 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    var spotLightRight = new THREE.SpotLight( objColor, 2);
    spotLightRight.position.set( -250, 250, -250 );
    spotLightRight.target.position.set( 0, 0, 0 );
    spotLightRight.castShadow = true;
    spotLightRight.shadow.camera.near = 10; // default
    spotLightRight.shadow.camera.far = 100; // default
    spotLightRight.angle = 0.6;
    spotLightRight.penumbra = 0.2;
    spotLightRight.decay = 200;
    spotLightRight.distance = 500;

    scene.add( spotLightRight.target );
    scene.add( spotLightRight );
    var lightHelperL = new THREE.SpotLightHelper( spotLightRight);
    scene.add(lightHelperL);

    var spotLightLeft = new THREE.SpotLight( objColor, 2);
    spotLightLeft.position.set( 250, 250, -250 );
    spotLightLeft.target.position.set( 10, -50, 0 );
    spotLightLeft.castShadow = true;
    spotLightLeft.shadow.camera.near = 10; // default
    spotLightLeft.shadow.camera.far = 100; // default
    spotLightLeft.angle = 0.6;
    spotLightLeft.penumbra = 0.2;
    spotLightLeft.decay = 200;
    spotLightLeft.distance = 500;

    scene.add( spotLightLeft.target );
    scene.add( spotLightLeft );
    var lightHelperR = new THREE.SpotLightHelper( spotLightLeft);
    scene.add(lightHelperR);
    sceneWrapp();

    var sphereG = new THREE.Group()
    var generatedX = -100;
    var generatedY = 0;
    var generatedZ = -300;
    for (let index = 0; index < 3; index++) {
        var objColor =  Math.random() * 0xff00000 - 0xff00000;
        var sphereItem = new sphere(50, 50, 50, objColor);
        sphereItem.castShadow = true;
        sphereItem.receiveShadow = false;
        sphereItem.name = 'sphere-' + index;
        sphereItem.position.x = generatedX;
        sphereItem.position.y = generatedY;
        sphereItem.position.z = generatedZ;
        generatedX += 220;
        generatedZ += 220;
        sphereG.add(sphereItem);
    }
    objCase.push(sphereG);
    scene.add( sphereG );

    var boxG = new THREE.Group()
    var generatedX = 100;
    var generatedY = 0;
    var generatedZ = 300;
    for (let index = 0; index < 3; index++) {
        var objColor =  Math.random() * 0xff00000 - 0xff00000;
        var boxItem = new box(30, 100, 30, objColor);
        boxItem.castShadow = true;
        boxItem.receiveShadow = false;
        boxItem.name = 'box-' + index;
        boxItem.position.x = generatedX;
        boxItem.position.y = generatedY;
        boxItem.position.z = generatedZ;
        generatedX -= 220;
        generatedZ -= 220;
        boxG.add(boxItem );
    }
    objCase.push(boxG);
    scene.add( boxG );

    // spotLightLeft.shadowCameraVisible = true;
    // spotLightRight.shadowCameraVisible = true;
    // directionalLight.shadowCameraVisible = true;
    // create the renderer
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.getElementById('output').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    mainLoop();

};

function distortionSphere(mesh, oscilator, amp) {
    var offset = mesh.geometry.parameters.radius;
    mesh.scale.x = (offset * oscilator * amp) + 0.01;
    mesh.scale.y = (offset * oscilator * amp) + 0.01;
    mesh.scale.z = (offset * oscilator * amp) + 0.01;
}

function distortionBox(mesh, oscilator, amp) {
    mesh.scale.y = (oscilator * amp * 3) + 0.01;
}

// main animation loop - calls 50-60 times per second.
var mainLoop = function() {
    if (dataArray.length > 0) {
        analyser.getByteFrequencyData(dataArray);

        var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
        var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

        var overallAvg = avg(dataArray);
        var lowerMax = max(lowerHalfArray);
        var lowerAvg = avg(lowerHalfArray);
        var upperMax = max(upperHalfArray);
        var upperAvg = avg(upperHalfArray);

        var lowerMaxFr = lowerMax / lowerHalfArray.length;
        var lowerAvgFr = lowerAvg / lowerHalfArray.length;
        var upperMaxFr = upperMax / upperHalfArray.length;
        var upperAvgFr = upperAvg / upperHalfArray.length;
    }
    objCase[0].children.forEach(element => {
        distortionSphere(element, modulate(Math.pow(lowerAvgFr, 3), 0, 1, 0, 8), 3);
    });
    objCase[1].children.forEach(element => {
        distortionBox(element, modulate(Math.pow(lowerAvgFr, 3), 0, 1, 0, 8), 100);
    });

    scene.rotation.y += 0.001;


    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

audioHandler();
