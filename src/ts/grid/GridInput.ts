import {Grid} from "./Grid";
import {Raycaster} from "three";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";
import {Unit} from "../unit/Unit";
import {HexTemplate} from "../gen/HexTemplate";
import {Utils} from "../utils/Utils";
import {BattleEvent} from "../network/Battle";
import {AnchoredSprite} from "../render/AnchoredSprite";

enum ActionMode {
  NONE, MOVEMENT, ATTACK
}

export class GridInput {

  private dom: HTMLCanvasElement
  private grid: Grid
  private caster: Raycaster

  private actionMode: ActionMode = ActionMode.NONE
  private selection: Unit = null

  private enabled = false

  constructor(grid: Grid) {
    this.grid = grid
    this.dom = document.getElementById('canvas') as HTMLCanvasElement
    this.caster = new Raycaster()

    let started = false
    let moved = false

    Facade.eloop.on(BattleEvent.MY_TURN_STARTED, e => {
      this.enabled = true
    })
    Facade.eloop.on(BattleEvent.MY_TURN_ENDED, e => {
      this.enabled = false
    })

    const getTarget = (e, camera, group) => {
      const normalizeX = v => (v/window.innerWidth) * 2 - 1
      const normalizeY = v => -(v/window.innerHeight) * 2 + 1

      let coords = null
      if (e instanceof MouseEvent) {
        coords = {
          x: normalizeX((<MouseEvent>e).clientX),
          y: normalizeY((<MouseEvent>e).clientY)
        }
      } else if (e instanceof TouchEvent) {
        coords = {
          x: normalizeX((<TouchEvent>e).changedTouches[0].clientX),
          y: normalizeY((<TouchEvent>e).changedTouches[0].clientY)
        }
      } else {
        throw 'Unknown type of event: ' + typeof e
      }

      this.caster.setFromCamera(coords, camera)
      const intersects = this.caster.intersectObjects(group)

      if (intersects.length <= 0) return
      return intersects[0].object
    }

    const selectHex = (e:MouseEvent|TouchEvent) => {
      if (!this.enabled) return
      started = false
      if (moved) { moved = false; return }
      e.preventDefault()

      Facade.$.renderer.ui.hideUnitMenu()

      const hex: Hexagon = getTarget(e, Facade.$.renderer.camera, this.grid.intersectGroup)['self']
      if (!hex) return
      const unit = grid.getUnitAt(hex.location)
      if (!unit && this.selection) {
        // show hexagon info?
        console.log('not unit but selection')
      } else if (unit && unit !== this.selection) {
        // selected another unit
        console.log('another unit')
      }
      if (this.selection) {
        if (this.actionMode === ActionMode.MOVEMENT) {
          const path = grid.findPath(hex.location, this.selection.location).reverse()
          path.splice(0, 1)
          if (hex.template.modifiers & HexTemplate.Modifiers.WALKABLE &&
            path.length < 3 && path.length > 0) {
            console.log(`%cmoving along path`, Utils.LOG_INPUT)
            Facade.$.executor.moveUnit(this.selection.location, path, true, true)
            this.selection = null
            this.actionMode = ActionMode.NONE
          }
        }
      } else {
        if (unit && unit.faction === Facade.$.connection.battle.faction) {
          this.selection = unit
          this.grid.deselectAll()
          grid.redrawVisibility()
          Facade.$.renderer.ui.showUnitControls(unit)
          this.dom.removeEventListener('touchend', selectHex)
          this.dom.removeEventListener('mouseup', selectHex)

          this.dom.addEventListener('touchend', selectAction)
          this.dom.addEventListener('mouseup', selectAction)
        }
      }
    }

    const selectAction = e => {
      started = false
      if (moved) { moved = false; return }
      e.preventDefault()

      const button = <AnchoredSprite>getTarget(e, Facade.$.renderer.ui.camera, Facade.$.renderer.ui.scene.children)
      if (button) {
        if (button.name === 'attack') {
          this.selection = null
        } else if (button.name === 'walk') {
          this.grid.deselectAll()
          grid.redrawVisibility()
          grid.drawReach(this.selection.location)
          this.actionMode = ActionMode.MOVEMENT
        } else if (button.name === 'cancel') {
          this.selection = null
        }
      } else {
        this.selection = null
      }
      Facade.$.renderer.ui.hideUnitMenu()

      this.dom.removeEventListener('touchend', selectAction)
      this.dom.removeEventListener('mouseup', selectAction)

      this.dom.addEventListener('touchend', selectHex)
      this.dom.addEventListener('mouseup', selectHex)
    }

    const onStart = () => {
      if (!this.enabled) return
      started = true
    }
    const onMove = e => {
      if (!this.enabled) return
      started ? moved = true : moved = false
      if (moved) return
      if (!this.selection) return
      if (this.actionMode === ActionMode.NONE) return

      e.preventDefault()
      if (this.actionMode === ActionMode.MOVEMENT) {
        const target: Hexagon = getTarget(e, Facade.$.renderer.camera, this.grid.intersectGroup)['self']
        if (!target) return
        this.grid.deselectAll()
        grid.redrawVisibility()
        grid.drawReach(this.selection.location)

        if (target.template.modifiers & HexTemplate.Modifiers.WALKABLE) {
          grid.drawPath(target.location, this.selection.location)
        }
      }

      if (this.actionMode === ActionMode.ATTACK) {

      }
    }

    this.dom.addEventListener('touchstart', onStart)
    this.dom.addEventListener('mousedown', onStart)

    this.dom.addEventListener('touchmove', onMove)
    this.dom.addEventListener('mousemove', onMove)

    this.dom.addEventListener('touchend', selectHex)
    this.dom.addEventListener('mouseup', selectHex)
  }
}