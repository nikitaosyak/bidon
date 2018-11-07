
export class Axial {
  public q: number = Number.NaN
  public r: number = Number.NaN

  public set(q: number, r: number): Axial {
    this.q = q; this.r = r; return this
  }

  toString() { return `Axial[${this.q}:${this.r}]` }
}

export class Cubic {
  public x: number = Number.NaN
  public y: number = Number.NaN
  public z: number = Number.NaN

  public set(x: number, y: number, z: number): Cubic {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  toString() { return `Cubic[${this.x}:${this.y}:${this.z}]` }
}

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

  public static lerp(a, b, t) { return a + (b-a) * t }

  public static cubicToAxial(v: Cubic): Axial {
    return new Axial().set(v.x, v.z)
  }

  public static axialToCubic(v: Axial): Cubic {
    return new Cubic().set(v.q, -v.q-v.r, v.r)
  }

  public static cubicToIndex(v: Cubic) { return v.z * this._width + v.x }
  public static axialToIndex(v: Axial) { return v.r * this._width + v.q }

  public static warpQ(v:number) {
    if (v < 0) return this._width+v
    if (v >= this._width) return v - this._width
    return v
  }

  public static warpR(v: number) {
    if (v < 0) return Number.NaN
    if (v >= this._height) return Number.NaN
    return v
  }

  // public static distance(a: Cubic, b: Cubic) {
  //   return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
  // }

  // public static lerpCube(a: Cubic, b: Cubic, t: number) {
  //   return new Cubic().set(
  //     this.lerp(a.x, b.x, t),
  //     this.lerp(a.y, b.y, t),
  //     this.lerp(a.z, b.z, t),
  //   )
  // }

  // public static line(a: Cubic, b: Cubic): Cubic[] {
  //   const len = this.distance(a, b)
  //   const result = []
  //   for (let i = 0; i < len; i++) {
  //     result.push()
  //   }
  //   return result
  // }
}