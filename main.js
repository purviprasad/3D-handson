import * as THREE from 'three';

// we can add mobility to the camera in
// order to see elements of the scene from
// different angles using the mouse buttons
// to do that we need to import the orbit
// control module
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//create instance of WEBGL renderer - a tool three.js uses to alocate a space on a webpage where we can add and animate all 3D stuff

const renderer = new THREE.WebGLRenderer()

//here i want that space to
//take all over the page by using the
//window inner width and height properties
renderer.setSize(window.innerWidth, window.innerHeight)

//inject that space (canvas element) into the page
document.body.appendChild(renderer.domElement)

//create a scene - it is like a container that holds
//all the 3D objects, lights and cameras
const scene = new THREE.Scene()

//create a camera - a tool three.js uses to look at
//the 3D scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// create an instance of OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(3)
//add axes helper to the scene
scene.add(axesHelper)

//move the camera back little bit so we can see the object
camera.position.set(0, 2, 5)
//update camera controls
orbit.update()

//create box
//geometry describes the shape
const boxGeometry = new THREE.BoxGeometry();
//material describes the appearance
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
//create the box by combining geometry and material
const box = new THREE.Mesh(boxGeometry, boxMaterial)
//add the box to the scene
scene.add(box)

function animate() {
    //make the box rotate
    //x is horizontal axis
    box.rotation.x += 0.01
    //y is vertical axis
    box.rotation.y += 0.01
    //z is depth axis
    box.rotation.z += 0.01

    //render the scene 
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// //render the scene 
// renderer.render(scene, camera)