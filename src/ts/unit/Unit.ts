import {Object3D} from "three";
import {Action} from "./Action";
import {Visual} from "../mixins";
import {Coord} from "../grid/GridUtils";

export class Unit implements Visual {

  public fraction: number;
  public location: Coord;
  private _behaviours: Action[]

  constructor(fraction:number, visual: Object3D, behaviours: Action[]) {
    this.fraction = fraction
    this.setVisual(visual)
    this._behaviours = behaviours
  }

  visual: Object3D;
  setVisual(v: Object3D): void {}
}