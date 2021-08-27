"use strict";

let scene,camera,renderer;

function init(){
    
    const stats = initStats();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(15,window.innerWidth/window.innerHeight,0.1,1000)
    camera.position.x = 15;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    let camera_controls = new THREE.OrbitControls(camera,document.body);
    camera_controls.rotateSpeed = 0.5;
    camera_controls.zoomsSpeed = 1.0;
    camera_controls.panSpeed = 1.0;

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById("WebGL-in").appendChild(renderer.domElement);

    let spheregeometry = new THREE.SphereGeometry(1,64,64);
    let spherematerial = raden_shader;
    let sphere = new THREE.Mesh(spheregeometry,spherematerial);
    scene.add(sphere);

    render();
    
    function initStats() {

        var stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-in").appendChild(stats.domElement);
        return stats;
    }

    function render(){
        stats.update();
        spherematerial.uniforms.time.value = 1.0;
        spherematerial.uniforms.resolution.value = new THREE.Vector2(window.screen.width,window.screen.height);
        spherematerial.uniforms.light_vector.value = new THREE.Vector3(1,1,1);
        spherematerial.uniforms.camera_position.value = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);

        requestAnimationFrame(render);
        renderer.render(scene,camera);
        camera_controls.update();


    }
}

function camera_resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init()
window.addEventListener('resize',camera_resize,false);