import THREE = require('three')

export class Renderer {

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
      clearColor: 0xCC0000,
      clearAlpha: 0,
      devicePixelRatio: window.devicePixelRatio,
      logarithmicDepthBuffer: false
    })
    this._renderer.setSize(800, 600)

    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(60, 800/600, 0.1, 100)
    this._camera.position.set(0, 0, 15)
    this._camera.lookAt(this._scene.position)

    var geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
    var mesh = new THREE.Mesh( geometry, material );
    this._scene.add( mesh );

    this._light = new THREE.DirectionalLight(0xFFFFFF, 1)
    this._light.position.set(10, 0, 10)
    this._scene.add(this._light)
  }

  public update(dt: number):void {
    this._renderer.render(this._scene, this._camera)
  }
}