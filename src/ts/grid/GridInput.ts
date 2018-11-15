import {Grid} from "./Grid";
import {Raycaster} from "three";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";
import {Unit} from "../unit/Unit";
import {GridUtils} from "./GridUtils";
import {HexTemplate} from "../gen/HexTemplate";

export class GridInput {

  private dom: HTMLCanvasElement
  private grid: Grid
  private caster: Raycaster

  private current: Unit = null

  constructor(grid: Grid) {
    this.grid = grid
    this.dom = document.getElementById('canvas') as HTMLCanvasElement
    this.caster = new Raycaster()

    let started = false
    let moved = false

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
      started = false
      if (moved) { moved = false; return }

      e.preventDefault()

      const target:Hexagon = getTarget(e)
      if (!target) return
      const targetUnit = grid.getU(target.location)
      if (!targetUnit && this.current) {
        console.log('moving somewhere')
      } else if (targetUnit && targetUnit !== this.current) {
        console.log('selecting new unit')
        this.current = null
      }
      if (this.current) {

      } else {
        if (targetUnit) {
          this.current = targetUnit
          this.grid.deselectAll()
          grid.redrawVisibility()
          grid.drawReach(target.location)
        }
      }
    }

    const onStart = () => started = true
    const onMove = e => {
      started ? moved = true : moved = false
      if (moved) return
      if (!this.current) return

      e.preventDefault()
      const target = getTarget(e)
      if (!target) return
      this.grid.deselectAll()
      grid.redrawVisibility()
      grid.drawReach(this.current.location)

      if (target.template.modifiers & HexTemplate.Modifiers.WALKABLE) {
        grid.drawPath(target.location, this.current.location)
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