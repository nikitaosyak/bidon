import {OrthographicCamera, Renderer, Scene} from "three";

export class UI {

  private _size = {x: 0, y: 0}
  private _camera: OrthographicCamera
  private _scene: Scene

  constructor() {
    this._size.x = 1
    this._size.y = 1

    this._camera = new OrthographicCamera(0, this._size.x, this._size.y, 0, 0.1, 10)

    // addTestSprite() {
    //   /**
    //    * @type {SpriteMaterialParameters}
    //    */
    //   const params = { texture: texture, color: 0xFFFFFF };
    //   const s = new Sprite(new SpriteMaterial(params));
    //   s.position.set(0.1, 0.1, -1);
    //   s.scale.set(0.2, 0.2, 1);
    //   scene.add(s);
    // },
  }

  public resize(ar: number) {
    this._size.x = 1
    this._size.y = 1
  }

  public render(renderer: Renderer) {
    renderer.render(this._scene, this._camera)
  }
}