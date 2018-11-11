import {HexTemplate} from "../gen/HexTemplate";
import {Visual} from "../mixins";
import {Mesh, MeshPhongMaterial} from "three";
import {Assets} from "../utils/Assets";
import {Coord, GridUtils} from "./GridUtils";

export class Hexagon implements Visual {

  private pos: Coord; public get location() { return this.pos }
  private template: HexTemplate

  constructor(q: number, r: number, template:HexTemplate) {
    this.pos = new Coord(q, r)

    this.template = template

    const meshTemplate = Assets.getAsset<Mesh>('hex')
    this.setVisual(new Mesh(meshTemplate.geometry.clone(), new MeshPhongMaterial({
      color: template.visualMarker,
    })))

    const myAngle = r * GridUtils.angle/2 + GridUtils.angle * q
    this.visual.position.set(
      Math.cos(myAngle) * GridUtils.radius,
      -r * 1.5,
      Math.sin(myAngle) * GridUtils.radius
    )
    this.visual.rotateY(-myAngle)
  }

  public select():void {
    this.visual.material['color'].set(0xAFAF00)
  }

  public selectAsNeighbour(): void {
    this.visual.material['color'].set(0xAf00Af)
  }

  public deselect():void {
    this.visual.material['color'].set(this.template.visualMarker)
  }

  visual: Mesh;
  setVisual(v: Mesh) {}
}
