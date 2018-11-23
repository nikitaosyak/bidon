import {Vector3} from "three";

export class Coord {
  private _q: number = Number.NaN
  private _r: number = Number.NaN

  public get q() { return this._q }
  public get r() { return this._r }

  public get x() { return this._q }
  public get y() { return -this._q-this._r }
  public get z() { return this._r }

  constructor(q: number = 0, r: number = 0) { this.set(q, r) }

  public set(q: number, r: number): Coord {
    this._q = q;
    this._r = r;
    return this
  }

  public setQ(v: number): Coord { this._q = v; return this }
  public setR(v: number): Coord { this._r = v; return this }

  public clone(): Coord { return new Coord(this.q, this.r) }

  public equals(v: Coord): boolean {
    return this._q === v.q && this._r === v.r
  }

  toString() { return `[${this._q}:${this._r}]` }
  serialize() { return { q: this._q, r: this._r }}
  public static serializeArray(values: Coord[]) {
    return values.map(v => v.serialize())
  }

  public static fromSerialized(v: any) { return new Coord(v.q, v.r) }
  public static fromSerializedArray(vs: any[]) { return vs.map(v => this.fromSerialized(v)) }

  private static pool: Coord[] = []
  public static getOne(): Coord {
    if (this.pool.length > 0) return this.pool.shift()
    return new Coord()
  }
  public static returnOne(v: Coord) {
    this.pool.push(v)
  }
}

export class GridUtils {

  private static _dirs = [
    new Coord(1, 0), new Coord(1, -1), new Coord(0, -1),
    new Coord(-1, 0), new Coord(-1, 1), new Coord(0, 1)
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

  public static spaceAngleFromCoord(v: Coord): number {
    return v.r * GridUtils.angle/2 + GridUtils.angle * v.q
  }

  public static setSpaceFromCoord(target: Vector3, v: Coord): void {
    const myAngle = this.spaceAngleFromCoord(v)
    target.set(Math.cos(myAngle) * GridUtils.radius,
      -v.r * 1.5,
      Math.sin(myAngle) * GridUtils.radius)
  }

  public static getSpaceFromCoord(v: Coord) : Vector3 {
    const myAngle = this.spaceAngleFromCoord(v)
    return new Vector3(Math.cos(myAngle) * GridUtils.radius,
      -v.r * 1.5,
      Math.sin(myAngle) * GridUtils.radius)
  }

  public static coordToIndex(v: Coord) { return v.r * this._width + v.q }

  public static getNeighbours(around: Coord) : Coord[] {
    const result = []
    this._dirs.forEach(d => {
      const lookupR = this._warpR(around.r + d.r)
      if (Number.isNaN(lookupR)) return
      const lookupQ = this._warpQ(around.q + d.q)
      result.push(Coord.getOne().set(lookupQ, lookupR))
    })
    return result
  }

  public static warpedDistance(a: Coord, b: Coord) : {a: Coord, b: Coord, d: number} {
    // sort coordinates so a is greater than b by column
    let _temp = a
    if (a.q < b.q) {
      a = b
      b = _temp
    }

    const distance = (Math.abs(a.x - b.x) +
                      Math.abs(a.y - b.y) +
                      Math.abs(a.z - b.z)) /2

    // warp a if the q-distance is more than half of grid width
    let _a = a
    const qDistance = Math.abs(_a.q - b.q)
    if (qDistance > this._width/2) {
      _a = a.clone().set(_a.q - this._width, _a.r)
    }

    const warpedDistance = (Math.abs(_a.x - b.x) +
                Math.abs(_a.y - b.y) +
                Math.abs(_a.z - b.z)) /2

    // in cases of high r-distances, unwarped distance can be more
    // efficient than warped one
    if (distance < warpedDistance) {
      return {a: a, b: b, d: distance}
    } else {
      return {a: _a, b: b, d: warpedDistance}
    }
  }

  private static lerp = (a:Coord, b:Coord, t:number) : Coord => {
    return Coord.getOne().set(
      a.x + (b.x - a.x) * t,
      a.z + (b.z - a.z) * t,
    )
  }

  private static round(v: Coord) : Coord {
    let rx = Math.round(v.x)
    let ry = Math.round(v.y)
    let rz = Math.round(v.z)

    const xDiff = Math.abs(rx - v.x)
    const yDiff = Math.abs(ry - v.y)
    const zDiff = Math.abs(rz - v.z)

    if (xDiff > yDiff && xDiff > zDiff) {
      rx = -ry-rz
    } else if (yDiff > zDiff) {
      ry = -rx-rz
    } else {
      rz = -rx-ry
    }

    return v.set(rx, rz)
  }

  public static line(a: Coord, b: Coord): Coord[] {
    const wDist = this.warpedDistance(a, b)
    const _a = wDist.a, _b = wDist.b, d = wDist.d

    if (d === 0) return [a.clone()]

    const result = []
    for (let i = 0; i <= d; i++) {
      result.push(this.round(this.lerp(_a, _b, 1/d * i)))
      if (result[i].q < 0) result[i].setQ(this._width + result[i].q)
    }

    return result
  }

  public static range(center: Coord, range: number): Coord[] {
    const result = []
    for (let x = center.x-range; x <= center.x+range; x++) {
      for (let y = center.y-range; y<=center.y+range; y++) {
        for (let z = center.z-range; z <= center.z+range; z++) {
          if (x + y + z !== 0) continue
          if (z < 0) continue
          if (z >= this._height) continue
          result.push(new Coord(this._warpQ(x), z))
        }
      }
    }
    return result
  }
}