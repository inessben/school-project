import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Water } from 'three/addons/objects/Water.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { GLTFLoader } from'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { FontLoader } from './modules/FontLoader.js'
import { TextGeometry } from './modules/TextGeometry.js'
import gsap from 'gsap'

// Loaders
//
// draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
// gltf
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
// textures 
const textureLoader = new THREE.TextureLoader()

// add texture
const floorTexture = textureLoader.load('/textures/floor.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(30, 100)
// 
const logoTexture = textureLoader.load('/textures/logo-igs.jpg')
logoTexture.wrapS = logoTexture.wrapT = THREE.RepeatWrapping
logoTexture.repeat.set(1, 1)

// 
// charge and add models
// add a barque on the sea
let barque
gltfLoader.load
(
    '/decor/barque.glb',
    (gltf) => 
    {
        barque = gltf.scene

        barque.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        barque.scale.set(16, 16, 16)
        barque.position.x= -40 
        barque.position.y= 6

        scene.add(barque)
    }
)
// add castles on the floor
let castle
gltfLoader.load
(
    '/decor/castle.glb',
    (gltf) => 
    {
        castle = gltf.scene

        castle.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        castle.scale.set(350, 350, 350)
        castle.position.x= -500
        castle.position.y= 500
        castle.position.z= -2700
        castle.rotation.y = Math.PI * 0.5
        scene.add(castle)
    }
)

let castleTwo
gltfLoader.load
(
    '/decor/castle.glb',
    (gltf) => 
    {
        castleTwo = gltf.scene

        castleTwo.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        castleTwo.scale.set(350, 350, 350)
        castleTwo.position.x= 700
        castleTwo.position.y= 500
        castleTwo.position.z= -2700
        castleTwo.rotation.y = Math.PI * 0.5
        scene.add(castleTwo)
    }
)

let castleThree
gltfLoader.load
(
    '/decor/castle.glb',
    (gltf) => 
    {
        castleThree = gltf.scene

        castleThree.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        castleThree.scale.set(350, 350, 350)
        castleThree.position.x= -1600
        castleThree.position.y= 500
        castleThree.position.z= -2700
        castleThree.rotation.y = Math.PI * 0.5
        scene.add(castleThree)
    }
)

let castleFour
gltfLoader.load
(
    '/decor/castle.glb',
    (gltf) => 
    {
        castleFour = gltf.scene

        castleFour.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        castleFour.scale.set(350, 350, 350)
        castleFour.position.x= -2900
        castleFour.position.y= 500
        castleFour.position.z= -2700
        castleFour.rotation.y = Math.PI * 0.5
        scene.add(castleFour)
    }
)

// add a scene
const scene = new THREE.Scene()

// add an inner size to the viewport
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

// resize the viewport
window.addEventListener('resize', () =>
{
    // Update sizes object
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// add a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 20000 )
camera.position.set( 8, 8, 8 )
scene.add(camera)

// add a directionnal light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.castShadow = true
directionalLight.position.x = - 1
directionalLight.position.y = 2
directionalLight.position.z = 3
scene.add(directionalLight)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio( window.devicePixelRatio )
document.body.appendChild(renderer.domElement)
renderer.toneMapping = THREE.ACESFilmicToneMapping

const loader = new FontLoader()
loader.load( 'sources/font/oswald.json', function ( oswald ) {
	const spaceBar = new TextGeometry( 'Hello three.js!', {
		font: oswald,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} )
} )

// add a floor
let floor = new THREE.Mesh(
    new THREE.BoxGeometry(3000, 20, 10000),
    new THREE.MeshBasicMaterial({ color: 0x4D4D4D, map: floorTexture})
)
floor.position.x = -250
floor.rotation.y = Math.PI * 0.5
floor.position.y = -3
floor.position.z = -2270
scene.add(floor)

// add the igs logo
const logo = new THREE.Mesh(
    new THREE.BoxGeometry(82, 82, 82),
    new THREE.MeshStandardMaterial({ color: 0xdddddd, map: logoTexture })
)
logo.position.x = 1
// logo.rotation.x = -0.2
logo.position.y = 45
logo.rotation.y = 5
logo.position.z = -1000
scene.add(logo)

// clic on the box
logo.addEventListener('click', function() {
    console.log(logo)
    const planeGeometry = new THREE.PlaneGeometry( 1000, 1000 )
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
    const plane = new THREE.Mesh( planeGeometry, planeMaterial )
    logo.add( plane )
})

//  GSAP to animate the cube
gsap.to(logo.position, {
    y: '+=30',
    duration: 1,
    repeat: -1, 
    yoyo: true 
})
gsap.to(logo.rotation, {
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "none",
    y: Math.PI
  })

// add the sun
const sun = new THREE.Vector3()

// add the sea
const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
const water = new Water(waterGeometry, 
    {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) 
        {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 0.1,
    fog: scene.fog !== undefined
    }
)
water.rotation.x = - Math.PI / 2
scene.add( water )

// add the sky 
const sky = new Sky()
sky.scale.setScalar( 10000 )
scene.add( sky )
const skyUniforms = sky.material.uniforms;
skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.8;
const parameters = {
    elevation: 2,
    azimuth: 180
}
const pmremGenerator = new THREE.PMREMGenerator( renderer )
let renderTarget
function updateSun() {
    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation )
    const theta = THREE.MathUtils.degToRad( parameters.azimuth )

    sun.setFromSphericalCoords( 1, phi, theta )

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun )
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize()

    if ( renderTarget !== undefined ) renderTarget.dispose()

    renderTarget = pmremGenerator.fromScene( sky )

    scene.environment = renderTarget.texture
}
updateSun()

// at the space key down, we change the camera viewer
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space'){
        camera.position.set( 0, 1, 1)
        barque.add(camera) 
    }
})

// Orbit Controls
// const controls = new OrbitControls( camera,  renderer.domElement )
// controls.enableDamping = true
// controls.maxPolarAngle = Math.PI * 0.495
// controls.target.set( 0, 10, 0 )
// controls.minDistance = 40.0
// controls.maxDistance = 200.0
// controls.update()

let isStopped = false
function stopAfterDelay() {
    isStopped = true
}
// délai de 25 secondes
setTimeout(stopAfterDelay, 30000) 

// requestAnimationFrame
const loop = () =>
{
    window.requestAnimationFrame(loop)

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    water.material.uniforms.time.value += 1.0 / 60.0

    if (!isStopped){
        if (barque !== null) {
            barque.position.z -= 0.27  
            barque.rotation.y = Math.sin(Date.now() * 0.0002) * Math.sin(Date.now() * 0.00001)
        }
    }
}
loop()
