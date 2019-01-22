import {Material, Sprite} from "three";

export class AnchoredSprite extends Sprite {

  private baseScale = {x: 1, y: 1}
  constructor(material: Material) {
    super(material);
  }

  public setScale(value:number) { this.scale.set(value, value, 1); return this }
  public setUnevenScale(x: number, y: number) { this.scale.set(x, y, 1); return this }
  public setName(value: string) { this.name = value; return this }
  public setPosition(x: number, y: number) { this.position.set(x, y, -1); return this }
  public setPivot(x: number, y: number) { this.center.set(x, y); return this }
}