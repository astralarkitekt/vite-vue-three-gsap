import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
// a POJO module that returns a controller for a three.js scene
// that renders a template scene
// has a constructor and 5 methods: init, createControls, events, spawn, render, and destroy

export default class SceneController {
  constructor(canvasElement) {
    this.canvas = canvasElement
    const canvasParent = this.canvas.parentElement
    this.canvas.width = canvasParent.clientWidth
    this.canvas.height = canvasParent.clientWidth
    this.sizes = {
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.width / this.canvas.height,
      0.1,
      10000
    )

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true })

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.clock = new THREE.Clock()

    this.timeline = gsap.timeline() // gsap timeline for animations

    this.init()
  }

  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1
    this.renderer.colorSpace = THREE.SRGBColorSpace

    // cam setup
    // nudging the camera back a bit
    this.camera.position.z = 5
    this.scene.add(this.camera)

    this.createControls()

    this.events()
  }

  createControls() {
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.95
    // set max pan, zoom, and dolly
    this.controls.maxPolarAngle = Math.PI / 2
    this.controls.maxDistance = 10
    this.controls.minDistance = 5

    this.controls.update()
  }

  events() {
    window.addEventListener('resize', () => {
      this.sizes.width = this.canvas.innerWidth
      this.sizes.height = this.canvas.innerHeight

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // raycasting a normalized mouse position
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
    })
  }

  // this is where you would create your objects and stage your scene
  spawn() {
    console.log('adding objects to scene')
    // create a cube
    const geometry = new THREE.BoxGeometry(3, 3, 3)
    const material = new THREE.MeshStandardMaterial({
      color: 0xefefef,
      roughness: 0.4,
      metalness: 0.6,
      map: new THREE.TextureLoader().load('/textures/albedo.png'),
      normalMap: new THREE.TextureLoader().load('/textures/normal.png'),
      roughnessMap: new THREE.TextureLoader().load('/textures/roughness.png')
    })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)

    // create a light
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 5)
    this.scene.add(light)

    this.render()
    this.tl()
  }

  render() {
    // const elapsedTime = this.clock.getElapsedTime()

    // update controls
    this.controls.update()

    // render
    this.renderer.render(this.scene, this.camera)

    // call the render method recursively
    window.requestAnimationFrame(() => {
      this.render()
    })
  }

  tl() {
    this.timeline.to(this.cube.rotation, {
      duration: 7,
      x: Math.PI * 2,
      y: Math.PI * 2,
      z: Math.PI * 2,
      ease: 'linear',
      yoyo: true,
      repeat: -1
    })
  }

  destroy() {
    // remove event listeners
    window.removeEventListener('resize', () => {
      this.sizes.width = this.canvas.innerWidth
      this.sizes.height = this.canvas.innerHeight

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // remove raycasting event listener
    window.removeEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
    })
  }
}
