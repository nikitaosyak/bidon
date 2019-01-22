import {OrthographicCamera, Renderer, Scene, SpriteMaterial, Texture} from "three";
import {Assets} from "../utils/Assets";
import {ScaledSprite} from "./ScaledSprite";

export class UI {

  private _size = {x: 0, y: 0}
  private _camera: OrthographicCamera
  private _scene: Scene

  private _unitMenu = []

  constructor() {
    this._size.x = 1
    this._size.y = 1

    this._camera = new OrthographicCamera(0, this._size.x, this._size.y, 0, 0.1, 10)
    this._scene = new Scene()

    this._unitMenu = [
      new ScaledSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_attack'), color: 0xffffff})).setBaseScaleX(0.08).setBaseScaleY(0.08),
      new ScaledSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_cancel'), color: 0xffffff})).setBaseScaleX(0.08).setBaseScaleY(0.08),
      new ScaledSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_walk'), color: 0xffffff})).setBaseScaleX(0.08).setBaseScaleY(0.08)
    ]


  }

  public resize(ar: number) {
    this._size.x = 1/ar
    this._size.y = 1
    this._scene.children.forEach(ch => {
      const scaled = <ScaledSprite>ch
      scaled.rescale(this._size)
    })
  }

  public showUnitMenu() {
    console.log('show ui')
    for (let i = 0; i < this._unitMenu.length; i++) {
      this._unitMenu[i].rescale(this._size)
      this._unitMenu[i].position.set(0.5 + i*0.1, 0.5, -1)
      this._scene.add(this._unitMenu[i])
    }
  }

  public hideUnitMenu() {
    console.log('hide ui')
    this._unitMenu.forEach(um => this._scene.remove(um))
  }

  public render(renderer: Renderer) {
    renderer.render(this._scene, this._camera)
  }
}