import {Object3D} from "three";
import {Visual} from "../mixins";
import {Coord} from "../grid/GridUtils";

export class Unit implements Visual {

  public fraction: number;
  public location: Coord;

  constructor(fraction:number, visual: Object3D) {
    this.fraction = fraction
    this.setVisual(visual)
  }

  visual: Object3D;
  setVisual(v: Object3D): void {}
}