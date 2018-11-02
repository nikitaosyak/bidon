
export class GridUtils {

  private static _width: number; public static get width() { return this._width }
  private static _height: number; public static get height() { return this._height }
  private static _angle: number; public static get angle() { return this._angle }
  private static _radius: number; public static get radius() { return this._radius }
  public static init(width: number, height: number, angle: number, radius: number) {
    this._width = width
    this._height = height
    this._angle = angle
    this._radius = radius
  }
}