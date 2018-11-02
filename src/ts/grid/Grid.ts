import {LandscapeGenerator} from "./LandscapeGenerator";
import THREE = require("three");
import {GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";

export class Grid {

  private map: Hexagon[]
  private group: THREE.Group

  constructor(width: number, height: number) {
    const layout = LandscapeGenerator.weightedRandomLayout(width, height)
    GridUtils.init(
      width,
      height,
      (Math.PI*2)/width,
      1.7 / (2*Math.tan(Math.PI/width))
    )

    this.map = []
    this.group = new THREE.Group()

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const h = new Hexagon(q, r, layout[r * width + q])
        this.group.add(h.visual)
      }
    }

    this.group.position.setY(((height-1)*1.5)/2)
    Facade.$.renderer.scene.add(this.group)

    console.log(GridUtils.angle * 180/Math.PI, GridUtils.radius)
  }

}