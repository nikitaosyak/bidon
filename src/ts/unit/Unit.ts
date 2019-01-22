import {Object3D} from "three";
import {Visual} from "../mixins";
import {Coord} from "../grid/GridUtils";

export class Unit implements Visual {

  public faction: number;
  public location: Coord;

  constructor(faction:number, visual: Object3D) {
    this.faction = faction
    this.setVisual(visual)
  }

  visual: Object3D;
  setVisual(v: Object3D): void {}
}