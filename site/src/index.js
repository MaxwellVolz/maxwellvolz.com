import * as THREE from 'three';
// import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
// import { Projector } from 'three/addons/renderers/Projector.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import vent_svg from './images/vent.svg';


let scene, camera, renderer;
let plane, cube; // Reference to the plane mesh

function init() {
    const container = document.getElementById('container');

    // Scene 
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);
    camera.lookAt(scene.position);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    // Plane with SVG texture
    const loader = new THREE.TextureLoader();
    loader.load(vent_svg, function (texture) {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
        plane.position.set(0, 0, 0);
        scene.add(plane);
    });

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(cubeGeometry, cube)
    cube.position.set(5, 3, 5);
    scene.add(cube);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();