import {Grid} from "./Grid";
import {Raycaster} from "three";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";
import {Coord} from "./GridUtils";

export class GridInput {

  private dom: HTMLCanvasElement
  private grid: Grid
  private caster: Raycaster

  constructor(grid: Grid) {
    this.grid = grid
    this.dom = document.getElementById('canvas') as HTMLCanvasElement
    this.caster = new Raycaster()

    let started = false
    let moved = false

    const normalizeX = v => (v/window.innerWidth) * 2 - 1
    const normalizeY = v => -(v/window.innerHeight) * 2 + 1
    const selectHex = (e:MouseEvent|TouchEvent) => {
      started = false
      if (moved) { moved = false; return }

      e.preventDefault()
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
      const intersects = this.caster.intersectObjects(this.grid.group.children)

      if (intersects.length <= 0) return
      const target:Hexagon = <Hexagon>intersects[0].object['self']
      if (target) {
        // grid.selectSingle(target.location)//selectNeighbours(target.location)
        // grid.selectNeighbours(target.location)
        // console.log(GridUtils.distance(target.location, new Coord(0, 0)))
        // grid.drawLine(new Coord(11, 2), target.location)
        // grid.drawVisibility(target.location)
        grid.drawPath(new Coord(0, 0), target.location)
      } else {
        console.warn('unknown object intersection!', intersects[0])
      }
    }

    const onStart = () => started = true
    const onMove = () => started ? moved = true : moved = false

    this.dom.addEventListener('touchstart', onStart)
    this.dom.addEventListener('mousedown', onStart)

    this.dom.addEventListener('touchmove', onMove)
    this.dom.addEventListener('mousemove', onMove)

    this.dom.addEventListener('touchend', selectHex)
    this.dom.addEventListener('mouseup', selectHex)
  }
}