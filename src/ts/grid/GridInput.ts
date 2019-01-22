import {Grid} from "./Grid";
import {Raycaster} from "three";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";
import {Unit} from "../unit/Unit";
import {HexTemplate} from "../gen/HexTemplate";
import {Utils} from "../utils/Utils";
import {BattleEvent} from "../network/Battle";

export class GridInput {

  private dom: HTMLCanvasElement
  private grid: Grid
  private caster: Raycaster

  private selection: Unit = null

  private enabled = false

  constructor(grid: Grid) {
    this.grid = grid
    this.dom = document.getElementById('canvas') as HTMLCanvasElement
    this.caster = new Raycaster()

    let started = false
    let moved = false

    Facade.$.connection.battle.on(BattleEvent.MY_TURN_STARTED, e => {
      this.enabled = true
    })
    Facade.$.connection.battle.on(BattleEvent.MY_TURN_ENDED, e => {
      this.enabled = false
    })

    const getTarget = e => {
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

      this.caster.setFromCamera(coords, Facade.$.renderer.camera)
      const intersects = this.caster.intersectObjects(this.grid.intersectGroup)

      if (intersects.length <= 0) return
      return <Hexagon>intersects[0].object['self']
    }

    const selectHex = (e:MouseEvent|TouchEvent) => {
      if (!this.enabled) return
      started = false
      if (moved) { moved = false; return }

      e.preventDefault()

      Facade.$.renderer.ui.hideUnitMenu()

      const hex:Hexagon = getTarget(e)
      if (!hex) return
      const unit = grid.getUnitAt(hex.location)
      if (!unit && this.selection) {
        // show hexagon info?
      } else if (unit && unit !== this.selection) {
        // selected another unit
        this.selection = null
      }
      if (this.selection) {
        // const path = grid.findPath(hex.location, this.selection.location).reverse()
        // path.splice(0, 1)
        // if (hex.template.modifiers & HexTemplate.Modifiers.WALKABLE &&
        //     path.length < 3 && path.length > 0) {
        //   console.log(`%cmoving along path`, Utils.LOG_INPUT)
        //   Facade.$.executor.moveUnit(this.selection.location, path, true, true)
        // }
      } else {
        if (unit && unit.faction === Facade.$.connection.battle.faction) {
          console.log('selected unit?')
          this.selection = unit
          this.grid.deselectAll()
          grid.redrawVisibility()
          Facade.$.renderer.ui.showUnitMenu()
          // grid.drawReach(target.location)
        }
      }
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

      e.preventDefault()
      const target = getTarget(e)
      if (!target) return
      // this.grid.deselectAll()
      // grid.redrawVisibility()
      // grid.drawReach(this.selection.location)

      // if (target.template.modifiers & HexTemplate.Modifiers.WALKABLE) {
      //   grid.drawPath(target.location, this.selection.location)
      // }
    }

    this.dom.addEventListener('touchstart', onStart)
    this.dom.addEventListener('mousedown', onStart)

    this.dom.addEventListener('touchmove', onMove)
    this.dom.addEventListener('mousemove', onMove)

    this.dom.addEventListener('touchend', selectHex)
    this.dom.addEventListener('mouseup', selectHex)
  }
}