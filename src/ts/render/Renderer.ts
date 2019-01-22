import THREE = require('three')
import {OrbitControls} from "three-orbitcontrols-ts";
import {Vector3} from "three";
import RendererStats  = require('@xailabs/three-renderer-stats') // MACRO: prod-cutout
import {IUpdatable} from "../mixins";
import {Resizer} from "./Resizer";
import {UI} from "./UI";

export class Renderer implements IUpdatable {

  private readonly _scene: THREE.Scene; get scene() { return this._scene }
  private readonly _camera: THREE.PerspectiveCamera; get camera() { return this._camera }
  private readonly _light: THREE.DirectionalLight; get light() { return this._light }
  private readonly _renderer: THREE.WebGLRenderer
  private readonly _controls: OrbitControls; get controls() { return this._controls }
  private readonly _ui: UI; get ui() { return this._ui }

  private readonly stats2: RendererStats// MACRO: prod-cutout

  constructor() {

    this.stats2 = new RendererStats()                   // MACRO: prod-cutout
    this.stats2.domElement.style.position	= 'absolute'  // MACRO: prod-cutout
    this.stats2.domElement.style.left	= '0px'           // MACRO: prod-cutout
    this.stats2.domElement.style.bottom	= '0px'         // MACRO: prod-cutout
    document.body.appendChild( this.stats2.domElement ) // MACRO: prod-cutout

    this._renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      precision: 'mediump',
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      stencil: true,
      preserveDrawingBuffer: false,
      devicePixelRatio: window.devicePixelRatio,
      logarithmicDepthBuffer: false
    })
    this._renderer.autoClear = false
    this._renderer.setSize(800, 600)
    this._renderer.setClearColor(0x140b33)
    this._renderer.setPixelRatio(window.devicePixelRatio)

    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(50, 800/600, 0.1, 100)
    this._camera.position.set(20, 0, 0)
    this._camera.lookAt(new Vector3(0, 0, 0))

    this._controls = new OrbitControls(this._camera)
    this._controls.minPolarAngle = Math.PI/2
    this._controls.maxPolarAngle = Math.PI/2
    this._controls.update()

    this._scene.add(new THREE.AmbientLight('#404040', 0.9))

    const l = new THREE.PointLight("#f0f0f0", 0.4, 100)
    l.position.set(5, 5, 5)
    this._scene.add(l)

    const l1 = new THREE.PointLight("#f0f0f0", 0.4, 100)
    l1.position.set(-5, -5, -5)
    this._scene.add(l1)

    this._ui = new UI(this._camera)
  }

  public resize(resizer: Resizer): void {
    this._renderer.setSize(resizer.width, resizer.height, true)
    this._camera.aspect = resizer.ar
    this._camera.updateProjectionMatrix()
    this._ui.resize(resizer.ar)
  }

  public update(dt: number):void {
    this._controls.update()

    this._renderer.clear()
    this._renderer.render(this._scene, this._camera)
    this._ui.render(this._renderer)
    this.stats2.update(this._renderer)// MACRO: prod-cutout
  }
}