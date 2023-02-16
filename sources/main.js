import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Water } from 'three/addons/objects/Water.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { GLTFLoader } from'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

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
// models
// 
// add a barge in the scene
let barge
gltfLoader.load
(
    '/decor/barge.glb',
    (gltf) => 
    {
        barge = gltf.scene

        barge.traverse((child) => 
        {
            if(child.isMesh)
                child.castShadow = true
                child.receiveShadow = true
        })

        barge.scale.set(13, 13, 13)
        barge.position.y= 5
        barge.add.camera
        scene.add(barge)
    }
)
// add a scene
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2( 0xffffff, 0.0001 )

// add texture
const floorTexture = textureLoader.load('/textures/floor.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(6, 6)

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
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 )
camera.position.set( 60, 80, 120 )
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

// add a floor
let floor = new THREE.Mesh(
    new THREE.BoxGeometry(3000, 20, 10000),
    new THREE.MeshBasicMaterial({ color: 0x4D4D4D, map: floorTexture})
)
floor.position.x = -250
floor.rotation.y = Math.PI * 0.5
floor.position.y = -3
floor.position.z = -3000
scene.add(floor)

// call the sun
const sun = new THREE.Vector3()

// the sea
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

// the sky 
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


window.addEventListener('keydown', function(e){
    console.log(barge)
    // 
    if (e.code === 'Space'){
    // positional audio 
        camera.position.set( 0, 1, 1)
        barge.add(camera) 
    }
})

// Orbit Controls
// const controls = new OrbitControls( renderer.domElement )
// controls.enableDamping = true
// controls.maxPolarAngle = Math.PI * 0.495
// controls.target.set( 0, 10, 0 )
// controls.minDistance = 40.0
// controls.maxDistance = 200.0
// controls.update()

// requestAnimationFrame
const loop = () =>
{
    window.requestAnimationFrame(loop)

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    water.material.uniforms.time.value += 1.0 / 60.0

    let endTime
    if (barge !== null) { 
        barge.position.z -= 0.3            
        barge.rotation.y = Math.sin(Date.now() * 0.0002) * Math.sin(Date.now() * 0.00001)
        (Date.now() - endTime < 20000) 
        }
    
}
loop()
