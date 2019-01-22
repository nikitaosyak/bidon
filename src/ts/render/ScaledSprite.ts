import {Material, Sprite} from "three";

export class ScaledSprite extends Sprite {

  private baseScale = {x: 1, y: 1}
  constructor(material: Material) {
    super(material);
  }

  public setScale(value:number) { this.scale.set(value, value, 1); return this }
  public setName(value: string) { this.name = value; return this }
}