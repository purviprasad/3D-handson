import * as THREE from 'three';

// we can add mobility to the camera in
// order to see elements of the scene from
// different angles using the mouse buttons
// to do that we need to import the orbit
// control module
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui'

//The CubeTextureLoader is designed to build a 3D environment skybox (a cube map) and strictly requires
//all 6 face images provided in its array to be perfect squares (e.g., 512x512, 1024x1024) 
//and all identical in size.
import stars from './img/stars_sq.jpg'
import purple from './img/purple_sq.jpg'

//create instance of WEBGL renderer - a tool three.js uses to alocate a space on a webpage where we can add and animate all 3D stuff
const renderer = new THREE.WebGLRenderer()
//enable shadow map
renderer.shadowMap.enabled = true

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
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//add the plane to the scene
scene.add(plane)

//Rotate plane so it faces the camera
//it should be flat on xz axis
plane.rotation.x = -0.5 * Math.PI

plane.receiveShadow = true

//add a grid helper to the scene
//grid helper is a grid that is displayed on the scene
//it is a helper to see the scene
// const gridHelper = new THREE.GridHelper(30)
//add grid helper to the scene
// scene.add(gridHelper)

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


const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false })

// MeshStandardMaterial uses the light - here it will appear black if no light source is added to the scene
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false })

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//add the sphere to the scene
scene.add(sphere)

sphere.position.set(0, 4, 0)
//enable shadow map for sphere
//this will make the sphere to cast shadow
sphere.castShadow = true

//add ambient light to the scene
//ambient light is a light that is emitted from all directions
//it is a light that is not directional
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

//add directional light to the scene
//directional light is a light that is emitted from a single direction
//it is a light that is directional

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)

//enable shadow map for directional light

// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12
// directionalLight.shadow.camera.top = 12
// directionalLight.shadow.camera.left = -12
// directionalLight.shadow.camera.right = 12
// directionalLight.shadow.camera.near = 0.1
// directionalLight.shadow.camera.far = 100


//add directional light helper to the scene
//directional light helper is a helper to see the directional light
//it is a helper to see the direction of the light
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

//add shadow helper to the scene
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)


//add point light to the scene
//point light is a light that is emitted from a single point
//it is a light that is directional
// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// scene.add(pointLight)

//add spotlight to the scene
//spotlight is a light that is emitted from a single point
//it is a light that is directional
const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)

//enable shadow map for spotlight
//this will make the spotlight to cast shadow
spotLight.castShadow = true

//set the angle of the spotlight
// angle is the size of the cone
spotLight.angle = 0.2

//set the penumbra of the spotlight
// penumbra is the fuzziness of the shadow- progressive blur effect to the edges of the spotlight shadow
// spotLight.penumbra = 0

//set the intensity of the spotlight
// intensity is the brightness of the spotlight
// In newer versions of Three.js (v155+), lights are physically correct by default.
// This means their brightness decays over distance quadratically. 
// For example, 1 (which represents 1 candela) was so dim it appeared to be completely off.
// spotLight.intensity = 10000

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

//add fog to the scene
//fog is a way to make the scene look more realistic
//it is a way to make the scene look more distant
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)

// FogExp2 is similar to fog but it is exponential
// The second parameter is the density of the fog
// The higher the density, the more the fog will obscure the scene
// scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

//set the clear color of the renderer
//this will clear the renderer with the specified color
// renderer.setClearColor(0xFFEA00)


const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load(stars)
// scene.background = texture

//import cubemap textures from the folder ./img
//Positive X, Negative X, Positive Y, Negative Y, Positive Z, Negative Z
//Positive X-Right, Negative X-Left, Positive Y-Top, Negative Y-Bottom, Positive Z-Front, Negative Z-Back
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    purple,
    purple,
    stars,
    stars,
    stars,
    stars
])

const box2Geometry = new THREE.BoxGeometry(4, 4, 4)
const box2Material = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    // map: textureLoader.load(purple)
})

//define an array of materials
//it will be used to create a box with different materials on each face
//order of materials: Right, Left, Top, Bottom, Front, Back
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(purple) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(purple) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) })
]
// const box2 = new THREE.Mesh(box2Geometry, box2Material)
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial)
scene.add(box2)

box2.position.set(0, 15, 10)

//box2.material is an array of materials
//so we can set the map for each material
// box2.material.map = textureLoader.load(purple)


const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10)
const plane2Material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, side: THREE.DoubleSide })
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
scene.add(plane2)
plane2.position.set(10, 10, 15)

//get the position of the vertices
// console.log(plane2.geometry.attributes.position.array)

//change the position of the vertices
//The plane has 11x11 = 121 vertices
//Each vertex has 3 coordinates (x, y, z)
//So the array has 121 * 3 = 363 elements
plane2.geometry.attributes.position.array[0] -= 10 * Math.random()
plane2.geometry.attributes.position.array[1] -= 10 * Math.random()
plane2.geometry.attributes.position.array[2] -= 10 * Math.random()

//get the last vertex
const lastVertex = plane2.geometry.attributes.position.array.length - 1
//set the z coordinate of the last vertex to 0
plane2.geometry.attributes.position.array[lastVertex] -= 10 * Math.random()


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
    angle: 0.2,
    penumbra: 0,
    intensity: 10000
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
gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 50000)


//create variable to control the animation of the sphere
let step = 0
//to control the speed of the animation
// let speed = 0.01

//create a 2d vector in which we are going to put
//the x and y values of the cursor position the second step is to add an event
//listener to catch the position of the cursor
const mousePosition = new THREE.Vector2(2, 2)
let isPointerOverCanvas = false
const sphereDefaultColor = sphere.material.color.clone()

//when the mouse moves over the canvas
//set the isPointerOverCanvas to true
//update the mousePosition vector with the normalized values of the cursor's coordinates e 
// client x is the value of the x position of the cursor
// window inner width is the width of the window thus the width of the canvas
// e client y is the value of the y position of the cursor and window inner height is the height of the window thus the height of the canvas

renderer.domElement.addEventListener('mousemove', function (e) {
    isPointerOverCanvas = true
    const rect = renderer.domElement.getBoundingClientRect()
    mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
})

//when the mouse leaves the canvas
//set the isPointerOverCanvas to false
//set the mousePosition to (2, 2)
//set the sphere color to the default color
renderer.domElement.addEventListener('mouseleave', function () {
    isPointerOverCanvas = false
    mousePosition.set(2, 2)
    sphere.material.color.copy(sphereDefaultColor)
})

box2.name = 'box2'

//create an instance of the raycaster class
const raycaster = new THREE.Raycaster()

const sphereId = sphere.id;

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

    //change the angle of the spotlight
    spotLight.angle = options.angle
    //change the penumbra of the spotlight
    spotLight.penumbra = options.penumbra
    //change the intensity of the spotlight
    spotLight.intensity = options.intensity
    //update the spotlight helper
    sLightHelper.update()

    //set the two ends of the ray which are the camera and the normalized mouse
    //position by calling the set from camera method from the raycaster
    raycaster.setFromCamera(mousePosition, camera)

    // variable that will hold an object that is returned by the intersect object's method 
    // this object will contain any element from the scene that intersects with the ray
    // const intersects = isPointerOverCanvas ? raycaster.intersectObjects([sphere, box2]) : []
    const intersects = raycaster.intersectObjects(scene.children)

    //if the pointer is over the canvas and the intersects array is not empty and 
    // the id of the intersected object is the same as the sphere's id 
    // then change the color of the sphere to red 
    // otherwise change the color of the sphere to the default color
    if (intersects.length > 0 && intersects[0].object.id === sphereId) {
        sphere.material.color.set(0xff0000)
    } else {
        sphere.material.color.copy(sphereDefaultColor)
    }

    //if pointer is over the canvas and the intersects array is not empty and
    // the id of the intersected object is the same as the box2's id
    // then change the rotation of the box2
    // otherwise change the rotation of the box2 to 0
    if (intersects.length > 0 && intersects[0].object.name === 'box2') {
        intersects[0].object.rotation.x += 0.01
        intersects[0].object.rotation.y += 0.01
    }


    plane2.geometry.attributes.position.array[0] = 10 * Math.random()
    plane2.geometry.attributes.position.array[1] = 10 * Math.random()
    plane2.geometry.attributes.position.array[2] = 10 * Math.random()
    plane2.geometry.attributes.position.array[lastVertex] = 10 * Math.random()
    plane2.geometry.attributes.position.needsUpdate = true

    //render the scene 
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// //render the scene 
// renderer.render(scene, camera)