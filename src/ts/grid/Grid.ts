import {LandscapeGenerator} from "./LandscapeGenerator";
import THREE = require("three");
import {GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";

export class Grid {

  private map: Hexagon[]
  private _group: THREE.Group; public get group() { return this._group }

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
        this._group.add(h.visual)
      }
    }

    this._group.position.setY(((height-1)*1.5)/2)
    Facade.$.renderer.scene.add(this._group)
  }

}