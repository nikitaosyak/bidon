import {LandscapeGenerator} from "./LandscapeGenerator";
import THREE = require("three");
import {Coord, GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";

export class Grid {

  private map: Hexagon[]
  private readonly _group: THREE.Group; public get group() { return this._group }

  public getH(c: Coord) : Hexagon { return this.map[GridUtils.coordToIndex(c)] }

  constructor(width: number, height: number) {
    const layout = LandscapeGenerator.weightedRandomLayout('oн hello', width, height)
    GridUtils.init(
      width,
      height,
      (Math.PI*2)/width,
      1.7 / (2*Math.tan(Math.PI/width))
    )

    this.map = []
    this._group = new THREE.Group()

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const h = new Hexagon(q, r, layout[r * width + q])
        this.map.push(h)
        this._group.add(h.visual)
      }
    }

    this._group.position.setY(((height-1)*1.5)/2)
    Facade.$.renderer.scene.add(this._group)
  }

  public selectSingle(target:Coord) {
    this.map.forEach(h => h.deselect())

    this.map[GridUtils.coordToIndex(target)].select()
  }

  public selectNeighbours(target:Coord) {
    this.map.forEach(h => h.deselect())

    GridUtils.getNeighbours(target).forEach(n => {
      this.map[GridUtils.coordToIndex(n)].selectAsNeighbour()
    })
  }

  public drawLine(from:Coord, target:Coord) {
    this.map.forEach(h => h.deselect())

    const line = GridUtils.line(from, target)
    line.forEach(ln => {
      this.map[GridUtils.coordToIndex(ln)].select()
    })
  }

  public drawVisibility(center:Coord) {
    this.map.forEach(h => h.deselect())

    this.getH(center).visited = this.getH(center).visible = true
    const result = [center]
    const iterate = (result, center, currentNeighbours) => {
      const nextNeighbours = []
      currentNeighbours.forEach(n => {

      })
    }
    iterate(result, center, GridUtils.getNeighbours(center))
    return result
  }
}