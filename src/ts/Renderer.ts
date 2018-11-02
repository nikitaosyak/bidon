import THREE = require('three')
import {OrbitControls} from "three-orbitcontrols-ts";
import {IUpdatable} from "./mixins";
import {Facade} from "./Facade";
import {Vector3} from "three";

export class Renderer implements IUpdatable {

  private readonly _scene: THREE.Scene; get scene() { return this._scene }
  private readonly _camera: THREE.PerspectiveCamera; get camera() { return this._camera }
  private readonly _light: THREE.DirectionalLight; get light() { return this._light }
  private readonly _renderer: THREE.WebGLRenderer
  private readonly _controls

  constructor() {

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

    const l = new THREE.PointLight("#ccffcc", 2, 100)
    l.position.set(5, 5, 5)
    this._scene.add(l)
  }

  public resize(): void {
    const resizer = Facade.$.resizer
    this._renderer.setSize(resizer.width, resizer.height, true)
    this._camera.aspect = resizer.ar
    this._camera.updateProjectionMatrix()
  }

  public update(dt: number):void {
    this._renderer.render(this._scene, this._camera)
    this._controls.update()
  }
}