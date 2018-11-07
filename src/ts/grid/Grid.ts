import {LandscapeGenerator} from "./LandscapeGenerator";
import THREE = require("three");
import {Axial, GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";

export class Grid {

  private map: Hexagon[]
  private readonly _group: THREE.Group; public get group() { return this._group }

  constructor(width: number, height: number) {
    const layout = LandscapeGenerator.weightedRandomLayout('oi hello', width, height)
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

  public selectSingle(target:Axial) {
    this.map.forEach(h => h.deselect())

    this.map[GridUtils.axialToIndex(target)].select()
  }

  private directions = [
    new Axial().set(1, 0), new Axial().set(1, -1), new Axial().set(0, -1),
    new Axial().set(-1, 0), new Axial().set(-1, 1), new Axial().set(0, 1)
  ]
  public selectNeighbours(target:Axial) {
    this.map.forEach(h => h.deselect())

    this.directions.forEach(d => {
      const lookupR = GridUtils.warpR(d.r + target.r)
      if (Number.isNaN(lookupR)) return
      const lookupQ = GridUtils.warpQ(d.q + target.q)
      this.map[GridUtils.axialToIndex(new Axial().set(lookupQ, lookupR))].selectAsNeighbour()
    })
  }

  public drawLine(target:Axial) {

  }
}