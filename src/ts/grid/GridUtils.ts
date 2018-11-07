
export class Coord {
  public q: number = Number.NaN
  public r: number = Number.NaN

  public get x() { return this.q }
  public get y() { return -this.q-this.r }
  public get z() { return this.r }

  public set(q: number, r: number): Coord {
    this.q = q; this.r = r; return this
  }

  toString() { return `[${this.q}:${this.r}]` }
}

export class GridUtils {

  private static _dirs = [
    new Coord().set(1, 0), new Coord().set(1, -1), new Coord().set(0, -1),
    new Coord().set(-1, 0), new Coord().set(-1, 1), new Coord().set(0, 1)
  ]

  private static _warpQ(v:number) {
    if (v < 0) return this._width+v
    if (v >= this._width) return v - this._width
    return v
  }

  private static _warpR(v: number) {
    if (v < 0) return Number.NaN
    if (v >= this._height) return Number.NaN
    return v
  }

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

  public static coordToIndex(v: Coord) { return v.r * this._width + v.q }

  public static getNeighbours(around: Coord) {
    const result = []
    this._dirs.forEach(d => {
      const lookupR = this._warpR(around.r + d.r)
      if (Number.isNaN(lookupR)) return
      const lookupQ = this._warpQ(around.q + d.q)
      result.push(new Coord().set(lookupQ, lookupR))
    })
    return result
  }

  // public static lerp(a, b, t) { return a + (b-a) * t }

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