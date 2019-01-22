import {Camera, OrthographicCamera, Renderer, Scene, SpriteMaterial, Texture, Vector3} from "three";
import {Assets} from "../utils/Assets";
import {AnchoredSprite} from "./AnchoredSprite";
import {Unit} from "../unit/Unit";
import {Facade} from "../Facade";
import {BattleEvent} from "../network/Battle";

export class UI {

  private _size = {x: 0, y: 0}
  private _projectionCamera: Camera
  private _camera: OrthographicCamera; get camera() { return this._camera }
  private _scene: Scene; get scene() { return this._scene }

  private selectedUnit: Unit
  private projVector = new Vector3()

  private _unitMenu = []
  private _yourMoveInd: AnchoredSprite
  private _enemyMoveInd: AnchoredSprite

  constructor(worldCamera: Camera) {
    this._projectionCamera = worldCamera
    this._size.x = 1
    this._size.y = 1

    this._camera = new OrthographicCamera(0, 1, 1, 0, 0.1, 10)
    this._scene = new Scene()

    this._unitMenu = [
      new AnchoredSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_attack'), color: 0xffffff})).setScale(0.12).setName('attack'),
      new AnchoredSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_cancel'), color: 0xffffff})).setScale(0.12).setName('cancel'),
      new AnchoredSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_walk'), color: 0xffffff})).setScale(0.12).setName('walk')
    ]

    this._yourMoveInd = new AnchoredSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_your_move')})).setUnevenScale(0.2, 0.05).setPosition(0, 0).setPivot(0, 0)
    this._enemyMoveInd = new AnchoredSprite(new SpriteMaterial({map: Assets.getAsset<Texture>('ui_enemy_move')})).setUnevenScale(0.2, 0.05).setPosition(0, 0).setPivot(0, 0)

    Facade.eloop.on(BattleEvent.MY_TURN_STARTED, e => {
      this._scene.remove(this._enemyMoveInd)
      this._scene.add(this._yourMoveInd)
    })
    Facade.eloop.on(BattleEvent.MY_TURN_ENDED, e => {
      this._scene.add(this._enemyMoveInd)
      this._scene.remove(this._yourMoveInd)
    })
  }

  public resize(ar: number) {
    this._size.x = 1
    this._size.y = 1/ar
    this._camera.top = this._size.y
    this._camera.updateProjectionMatrix()
    this._camera.updateMatrixWorld(true)
    this.updateUnitControls()
  }

  private updateUnitControls() {
    if (!this.selectedUnit) return
    this.projVector.setFromMatrixPosition(this.selectedUnit.visual.matrixWorld)
    this.projVector.project(this._projectionCamera)
    this.projVector.x = (this.projVector.x * this._size.x/2) + this._size.x/2
    this.projVector.y = this._size.y-(-(this.projVector.y * this._size.y/2) + this._size.y/2)

    for (let i = 0; i < this._unitMenu.length; i++) {
      this._unitMenu[i].position.set(this.projVector.x - 0.12 + i * 0.12, this.projVector.y, -1)
    }
  }

  public showUnitControls(target: Unit) {
    this.selectedUnit = target
    this._unitMenu.forEach(um => this._scene.add(um))
  }

  public hideUnitMenu() {
    this.selectedUnit = null
    this._unitMenu.forEach(um => this._scene.remove(um))
  }

  public render(renderer: Renderer) {
    this.updateUnitControls()
    renderer.render(this._scene, this._camera)
  }
}