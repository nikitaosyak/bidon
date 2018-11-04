import {HexTemplate} from "../gen/HexTemplate";
import {Visual} from "../mixins";
import {Mesh, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial} from "three";
import {Assets} from "../utils/Assets";
import {GridUtils} from "./GridUtils";

export class Hexagon implements Visual {

  private q: number
  private r: number
  private template: HexTemplate

  constructor(q: number, r: number, template:HexTemplate) {
    this.q = q
    this.r = r
    this.template = template

    const meshTemplate = Assets.getAsset<Mesh>('hex')
    this.setVisual(new Mesh(meshTemplate.geometry.clone(), new MeshPhongMaterial({
      color: template.visualMarker,
    })))
    this.visual.material['color'].set()

    const myAngle = r * GridUtils.angle/2 + GridUtils.angle * q
    this.visual.position.set(
      Math.cos(myAngle) * GridUtils.radius,
      -r * 1.5,
      Math.sin(myAngle) * GridUtils.radius
    )
    this.visual.rotateY(-myAngle)
  }

  visual: Mesh;
  setVisual(v: Mesh) {}
}
