import {Material, Sprite} from "three";

export class ScaledSprite extends Sprite {

  private baseScale = {x: 1, y: 1}
  constructor(material: Material) {
    super(material);
  }

  setBaseScaleX(x: number) { this.baseScale.x = x; return this }
  setBaseScaleY(y: number) { this.baseScale.y = y; return this }

  rescale(size) {
    this.scale.set(this.baseScale.x * size.x, this.baseScale.y * size.y, 1)
  }
}