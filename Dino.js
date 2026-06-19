import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b2b2b);

// camera
const camera = new THREE.PerspectiveCamera(
    23, // field of view (FOV) in degrees — higher = wider view, objects look smaller
    window.innerWidth / window.innerHeight, // aspect ratio (matches screen)
    0.1, // near clipping plane — anything closer is invisible
    1000 // far clipping plane — anything farther is invisible
);

camera.position.set(-2, 5, 15); // camera position (x=left/right, y=up/down, z=forward/back)

// renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 30;
controls.target.set(-1, -2, 4); // point camera to look at the dino

const homePos = new THREE.Vector3(-2, 5, 15); // camera returns here after orbit
let isInteracting = false;
let idleTime = 0;

controls.addEventListener('start', () => { isInteracting = true; idleTime = 0; });
controls.addEventListener('end', () => { isInteracting = false; idleTime = 0; });

// loader
const loader = new GLTFLoader();

// grid
const grid = new THREE.GridHelper(30, 20, 0x666666, 0x333333);
grid.position.set(-2, -4, 4);
scene.add(grid);

// lights
const light1 = new THREE.SpotLight(0xffffff, 100);
light1.position.set(3, 2, 8);
light1.target.position.set(-5, -1, 4);
light1.angle = 0.35;
light1.penumbra = 0.5;
light1.decay = 1;
scene.add(light1);
scene.add(light1.target);

const fillLeft = new THREE.DirectionalLight(0xffffff, 0.7);
fillLeft.position.set(-5, 1, 6);
scene.add(fillLeft);

const fillRight = new THREE.DirectionalLight(0xffffff, 0.7);
fillRight.position.set(5, 1, 6);
scene.add(fillRight);

scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// load model
loader.load('./models/dino.glb', (gltf) => {

    gltf.scene.scale.set(0.1, 0.1, 0.1); // size multiplier (higher = bigger)
    gltf.scene.position.set(-2.5, -4, 4); // x=left/right, y=up/down, z=forward/backward
    gltf.scene.rotation.set(0, Math.PI / 1.25, 0); // x=pitch, y=yaw(which way it faces), z=roll (radians)
    scene.add(gltf.scene);

});


// animation loop
function animate() {

    requestAnimationFrame(animate);

    // return to home after 1 second of no interaction
    if (!isInteracting) {
        idleTime += 16; // ~16ms per frame at 60fps
        if (idleTime > 1000) {
            camera.position.lerp(homePos, 0.02);
            controls.target.lerp(new THREE.Vector3(-1, -2, 4), 0.02);
        }
    }

    controls.update();
    renderer.render(scene, camera);

}

animate();
