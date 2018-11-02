import {HexTemplate} from "../gen/HexTemplate";
import {VisualHex} from "../mixins";
import {Mesh, Object3D} from "three";
import {Assets} from "../utils/Assets";
import {GridUtils} from "./GridUtils";

export class Hexagon implements VisualHex {

  private q: number
  private r: number
  private template: HexTemplate

  constructor(q: number, r: number, template:HexTemplate) {
    this.q = q
    this.r = r
    this.template = template

    this.setVisual(Assets.getAsset<Mesh>('hex').clone())


    const myAngle = r * GridUtils.angle/2 + GridUtils.angle * q
    this.visual.position.set(
      Math.cos(myAngle) * GridUtils.radius,
      -r * 1.5,
      Math.sin(myAngle) * GridUtils.radius
    )
    this.visual.rotateY(-myAngle)
  }

  visual: Object3D;
  setVisual(v: Object3D) {}
}
