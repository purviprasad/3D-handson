// Import the core Three.js library which provides the building blocks for 3D (vectors, scenes, math, etc.)
import * as THREE from 'three';

// Import the WebGPURenderer. This is the engine that actually draws the 3D scene to your screen using the modern WebGPU API.
import { WebGPURenderer } from 'three/webgpu';

// Import OrbitControls. This allows the user to rotate the camera around the scene using their mouse.
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import TransformControls. This provides the interactive 3D arrows (gizmos) to move, rotate, or scale an object.
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

// Import GLTFLoader. This is the tool used to load 3D models in the .gltf or .glb format.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import DRACOLoader. This handles compressed geometry found in optimized .glb files.
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Import dat.gui. This creates the small settings panel in the top right corner of the screen.
import * as dat from 'dat.gui';

// --- Global Variables ---
// We define these here so they can be accessed by any function in this file.
let camera, scene, renderer;
let orbit, transformControl;
let model;

// Start the application
init();

async function init() {
    // 1. Create a container (a <div> tag) and add it to the HTML page. 
    // The renderer will place its drawing canvas inside this container.
    const container = document.createElement('div');
    document.body.appendChild(container);

    // 2. Setup the WebGPU Renderer
    // 'antialias: true' smooths out the jagged edges of 3D objects.
    renderer = new WebGPURenderer({ antialias: true });

    // Adjust the renderer's pixel ratio so it looks sharp on high-resolution screens (like Retina displays)
    renderer.setPixelRatio(window.devicePixelRatio);

    // Set the drawing canvas to take up the full width and height of the browser window.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // WebGPU requires us to 'await' its initialization before we can start using it.
    await renderer.init();

    // Tone mapping makes the colors look more realistic and cinematic, handling bright lights better.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Enable shadows in the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Finally, inject the <canvas> element into our container.
    container.appendChild(renderer.domElement);

    // 3. Setup the Scene
    // The scene is the container that holds all our 3D objects, lights, and cameras.
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333); // Set a dark gray background color

    // 4. Setup Lighting
    // HemisphereLight adds a soft ambient light that simulates the sky above and the ground below.
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // DirectionalLight simulates the sun. It casts harsh shadows and provides directional illumination.
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 5, -3);
    dirLight.castShadow = true; // Allow this light to cast shadows

    // Increase the shadow camera boundaries so it covers the entire room, not just a small 5x5 area
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.mapSize.width = 2048; // Higher resolution shadows
    dirLight.shadow.mapSize.height = 2048;

    scene.add(dirLight);

    // 5. Setup the Camera
    // A PerspectiveCamera mimics how the human eye sees things (objects further away appear smaller).
    // Arguments: Field of View (45 degrees), Aspect Ratio, Near clipping plane (0.25), Far clipping plane (100)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(-2, 1.5, 3); // Position the camera slightly back and up

    // 6. Add OrbitControls (Camera Movement)
    // This connects the camera to the mouse events on the canvas, allowing you to drag to rotate.
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // 7. Add TransformControls (Object Movement)
    // This creates the 3D arrows(gizmos) used to move/rotate the object itself.
    transformControl = new TransformControls(camera, renderer.domElement);

    // When the user starts dragging the object arrows, we must disable the OrbitControls 
    // so the camera doesn't accidentally move at the same time.
    transformControl.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value;
    });

    // TransformControls no longer behaves like a standard 3D object in modern Three.js.
    // We must retrieve its internal visual "helper" and add that to the scene instead.
    scene.add(transformControl.getHelper());

    // 8. Load the Room Environment
    const loader = new GLTFLoader();

    // Setup DRACOLoader to decode compressed geometry (needed for highly optimized models)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    // in glb file there are meshes, materials, lights and camera
    // in glb file we can load multiple objects
    // in glb file we can load multiple materials
    // in glb file we can load multiple lights
    // in glb file we can load multiple cameras
    // gtlf file extension is .glb or .gltf - here we are using .glb because it is a binary format and it is smaller in size
    // glb file is a compressed version of gltf file

    loader.load('./src/models/commercial-office-room.glb', function (gltf) {
        const room = gltf.scene;
        // Traverse the room's children. Setting receiveShadow on a Group doesn't work; it must be on the Meshes.
        room.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        scene.add(room);
    }, undefined, function (error) {
        console.error('Error loading room:', error);
    });

    // 9. Setup the User Interface (dat.GUI)
    const gui = new dat.GUI();

    // This object holds the current state of our settings.
    const state = {
        transformMode: 'translate',
        variant: 'default',
    };

    // Add a dropdown to the GUI that maps 'Move', 'Rotate', and 'Scale' to the Three.js commands.
    gui.add(state, 'transformMode', { Move: 'translate', Rotate: 'rotate', Scale: 'scale' })
        .name('Transform Mode')
        .onChange((mode) => {
            // When the user picks a new mode, update the transform controls.
            transformControl.setMode(mode);
        });

    // 10. Load the Chair Model
    // We load the provided chair model into the room
    loader.load('./src/models/advanced-ergonomic-chair.glb', function (gltf) {
        model = gltf.scene; // The main 3D group of the loaded model

        // Traverse the chair to enable casting shadows from all its individual meshes
        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Ensure the chair is at the origin initially (you can move it using TransformControls)
        model.position.set(0, 0, 0);

        scene.add(model); // Add the model to the scene

        // Attach the transform controls to the model so the arrows appear on it.
        transformControl.attach(model);

        // 11. Handle GLTF Material Variants
        // Some advanced GLTF files contain multiple materials (like color options) inside a single file.
        // We extract the 'KHR_materials_variants' extension to see if this model has any variants.
        const parser = gltf.parser;
        const variantsExtension = gltf.userData.gltfExtensions?.['KHR_materials_variants'];

        // If variants exist, add them to the GUI
        if (variantsExtension && variantsExtension.variants) {

            // Extract just the names of the variants (e.g. "leather", "fabric")
            const variantNames = variantsExtension.variants.map((v) => v.name);
            state.variant = variantNames[0]; // Set the default variant state

            // Create the dropdown menu for the variants
            gui.add(state, 'variant', variantNames)
                .name('Material Variant')
                .onChange((variantName) => {
                    // When the user selects a new variant, call our custom function to apply it
                    selectVariant(model, parser, variantsExtension, variantName);
                });

            // Force the first variant to be applied immediately upon loading
            selectVariant(model, parser, variantsExtension, state.variant);
        }
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });

    // 12. Handle Window Resizing
    // If the user resizes their browser, we need to update the camera and renderer to match the new size.
    window.addEventListener('resize', onWindowResize);

    // 13. Start the Animation Loop
    // This tells the renderer to continuously draw the scene as fast as the monitor refreshes (e.g. 60 FPS).
    renderer.setAnimationLoop(animate);
}

/**
 * A custom function to apply a material variant to a GLTF model.
 * It traverses the model, finds meshes that support variants, and swaps out their active material.
 */
async function selectVariant(scene, parser, extension, variantName) {
    // Find the internal index number of the chosen variant name
    const variantIndex = extension.variants.findIndex((v) => v.name === variantName);
    if (variantIndex === -1) return;

    // Traverse walks through every single piece of geometry inside the 3D model
    scene.traverse(async (object) => {
        // If the object isn't a Mesh, or doesn't have material variants, skip it.
        if (!object.isMesh || !object.userData.gltfExtensions) return;

        const meshExtension = object.userData.gltfExtensions['KHR_materials_variants'];
        if (!meshExtension) return;

        // Check if this specific piece of the model has a mapping for our chosen variant
        const mapping = meshExtension.mappings.find((m) => m.variants.includes(variantIndex));

        if (mapping) {
            // Ask the GLTF parser to give us the actual Material object based on the mapping ID
            const material = await parser.getDependency('material', mapping.material);

            // Apply the new material to the object
            object.material = material;
        }
    });
}

/**
 * This function is called every time the browser window is resized.
 */
function onWindowResize() {
    // Update the camera's aspect ratio so the scene doesn't look squished or stretched.
    camera.aspect = window.innerWidth / window.innerHeight;

    // have to call this after changing the camera properties.
    camera.updateProjectionMatrix();

    // Update the renderer to draw at the new resolution.
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * This is the main loop function that runs 60 times a second(60 FPS)
 */
function animate() {
    // Ask the WebGPU renderer to asynchronously draw the current state of the scene from the perspective of the camera.
    renderer.renderAsync(scene, camera);
}
