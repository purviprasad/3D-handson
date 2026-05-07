import * as THREE from 'three';

// we can add mobility to the camera in
// order to see elements of the scene from
// different angles using the mouse buttons
// to do that we need to import the orbit
// control module
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui'

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
// camera.position.set(0, 2, 5)
//set camera position from top to see more of the scene
camera.position.set(-10, 30, 30)
//update camera controls
orbit.update()

//create box
//geometry describes the shape/skeleton

const boxGeometry = new THREE.BoxGeometry();
//material describes the appearance/skin/color
//MeshBasicMaterial doesn't use the light - is lightweight
//MeshStandardMaterial uses the light - is realistic
//MeshLambertMaterial uses the light - is realistic but doesn't reflect light
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
//create the box by combining geometry and material
const box = new THREE.Mesh(boxGeometry, boxMaterial)
//add the box to the scene
scene.add(box)

//add a plane to the scene
// the plane is at y=0 and it extends from -15 to 15
const planeGeometry = new THREE.PlaneGeometry(30, 30)
//add side: THREE.DoubleSide to the plane material
//this will make the plane visible from both sides
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//add the plane to the scene
scene.add(plane)

//Rotate plane so it faces the camera
//it should be flat on xz axis
plane.rotation.x = -0.5 * Math.PI


//add a grid helper to the scene
//grid helper is a grid that is displayed on the scene
//it is a helper to see the scene
const gridHelper = new THREE.GridHelper(30)
//add grid helper to the scene
scene.add(gridHelper)

//create a sphere
//a sphere is defined by its radius
//radius: 4 means the sphere will have a radius of 4
// const sphereGeometry = new THREE.SphereGeometry(4)

//in the constructor of the sphere geometry, we can pass the number of segments
//the more segments we pass, the more detailed the sphere will be
//the number of segments is the number of points on the sphere
//the number of segments on the x axis is 10
//the number of segments on the y axis is 10
// const sphereGeometry = new THREE.SphereGeometry(4, 10, 10)


//to make the sphere more detailed we pass 32 for both x and y segments
const sphereGeometry = new THREE.SphereGeometry(4, 32, 32)

//wireframe: true will show the skeleton/edges of the sphere
// const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })


const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false })

// MeshStandardMaterial uses the light - here it will appear black if no light source is added to the scene
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false })

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//add the sphere to the scene
scene.add(sphere)

sphere.position.set(0, 4, 0)

const gui = new dat.GUI()

//define the options for the GUI
//we are going to add these options to the GUI
//when the user changes the options

//the sphere color and wireframe will change

//add a slider to the GUI
//it will add a slider to the GUI
//when the user slides the slider
//the sphere speed will change
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
}

//add color picker to the GUI
//it will add a color picker to the GUI
//when the user changes the color
//the sphere color will change
gui.addColor(options, 'sphereColor')
    .onChange(function (value) {
        sphere.material.color.set(value)
    })

//add wireframe toggle to the GUI
//it will add a checkbox to the GUI
//when the user checks the checkbox
//the wireframe will be enabled
gui.add(options, 'wireframe')
    .onChange(function (value) {
        sphere.material.wireframe = value
    })

//add slider to control the speed of the animation
//it will add a slider to the GUI
//when the user slides the slider
//the sphere speed will change
//the first parameter is the options object
//the second parameter is the name of the property to be controlled
//the third parameter is the minimum value
//the fourth parameter is the maximum value
gui.add(options, 'speed', 0, 0.1)

//create variable to control the animation of the sphere
let step = 0
//to control the speed of the animation
let speed = 0.01

function animate() {
    //make the box rotate
    //x is horizontal axis
    box.rotation.x += 0.01
    //y is vertical axis
    box.rotation.y += 0.01
    //z is depth axis
    box.rotation.z += 0.01

    //change the y position of the sphere
    //it will go up and down
    // step += speed
    step += options.speed
    sphere.position.y = 10 * Math.abs(Math.sin(step))

    //render the scene 
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// //render the scene 
// renderer.render(scene, camera)