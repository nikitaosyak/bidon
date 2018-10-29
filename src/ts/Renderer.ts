import THREE = require('three')
import {IUpdatable} from "./mixins";
import {Facade} from "./Facade";

export class Renderer implements IUpdatable {

  private readonly _scene: THREE.Scene; get scene() { return this._scene }
  private readonly _camera: THREE.PerspectiveCamera; get camera() { return this._camera }
  private readonly _light: THREE.DirectionalLight; get light() { return this._light }
  private readonly _renderer: THREE.WebGLRenderer

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

    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(60, 800/600, 0.1, 100)
    this._camera.position.set(0, 0, 15)
    this._camera.lookAt(this._scene.position)
  }

  public resize(): void {
    const resizer = Facade.$.resizer
    this._renderer.setSize(resizer.width, resizer.height, true)
    this._camera.aspect = resizer.ar
    this._camera.updateProjectionMatrix()
  }

  public update(dt: number):void {
    this._renderer.render(this._scene, this._camera)
  }
}