import {LandscapeGenerator} from "./LandscapeGenerator";
import {Coord, GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon, HighlightMode} from "./Hexagon";
import {HexTemplate} from "../gen/HexTemplate";
import {PriorityQueue} from "../utils/PriorityQueue";
import {Unit} from "../unit/Unit";
import {Group, Mesh} from "three";
import Modifiers = HexTemplate.Modifiers;

export class Grid {

  private _map: Hexagon[]; public get map() { return this._map }
  private readonly _group: Group; public get group() { return this._group }

  private readonly _intersectGroup: Mesh[]; public get intersectGroup() { return this._intersectGroup }

  private _units: Unit[]; public get units() { return this._units };
  public getU(c: Coord) : Unit { return this._units[GridUtils.coordToIndex(c)] }
  public getH(c: Coord) : Hexagon { return this._map[GridUtils.coordToIndex(c)] }

  private dirty = true; public setDirty() { this.dirty = true }

  constructor(width: number, height: number) {
    const layout = LandscapeGenerator.weightedRandomLayout('oн hello', width, height)
    GridUtils.init(
      width,
      height,
      (Math.PI*2)/width,
      1.7 / (2*Math.tan(Math.PI/width))
    )

    this._map = []
    this._units = []
    this._group = new Group()
    this._intersectGroup = []

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const h = new Hexagon(q, r, layout[r * width + q])
        this._map.push(h)
        this._group.add(h.visual)
        this._intersectGroup.push(h.visual)
      }
    }

    this._group.position.setY(((height-1)*1.5)/2)
    Facade.$.renderer.scene.add(this._group)
  }

  public addUnit(v: Unit, c: Coord): void {
    if (this._units.indexOf(v) > -1) {
      console.warn(`trying to add unit ${v}, but it's already on grid`)
      return
    }
    v.location = c
    this._units[GridUtils.coordToIndex(c)] = v
    GridUtils.setSpaceFromCoord(v.visual.position, c)
    v.visual.rotateY(-GridUtils.spaceAngleFromCoord(c))
    this._group.add(v.visual)
  }

  public moveUnitInternal(v: Unit, to: Coord) : void {
    this._units[GridUtils.coordToIndex(v.location)] = null
    this._units[GridUtils.coordToIndex(to)] = v
    v.location = to
  }

  // public selectSingle(target:Coord) {
  //   this._map.forEach(h => h.deselect())
  //
  //   this._map[GridUtils.coordToIndex(target)].select()
  // }

  // public selectNeighbours(target:Coord) {
  //   this._map.forEach(h => h.deselect())
  //
  //   GridUtils.getNeighbours(target).forEach(n => {
  //     this._map[GridUtils.coordToIndex(n)].selectAsNeighbour()
  //   })
  // }

  // public drawLine(from:Coord, target:Coord) {
  //   // this._map.forEach(h => h.deselect())
  //
  //   const line = GridUtils.line(from, target)
  //   line.forEach(ln => {
  //     this._map[GridUtils.coordToIndex(ln)].select()
  //   })
  // }
  public deselectAll() {
    this._map.forEach(h => h.clearState())
  }

  public drawReach(center:Coord) {
    // breadth first search implementation
    let depth = 3
    let queue = [center]
    while (depth --> 0) {
      let newQueue = []
      queue.forEach(q => {
        const qHex = this.getH(q)
        if (qHex.visited) return
        const reachable = qHex.template.modifiers&Modifiers.WALKABLE
        if (reachable) {
          newQueue = newQueue.concat(GridUtils.getNeighbours(q))
          qHex.highlight(HighlightMode.REACH)
        }
      })
      queue = newQueue
    }
    this._map.forEach(h => h.visited = false)
  }

  public drawVisibility(center:Coord) {
    // this._map.forEach(h => h.deselect())

    const range = GridUtils.range(center, 3)
    range.forEach(c => {
      let line = GridUtils.line(center, c)
      if (line[line.length-1].equals(center)) line = line.reverse()
      let i = 0, h = this.getH(line[i])
      while ((h.template.modifiers&Modifiers.NONOBSTRUCTING) > 0) {
        !h.visited && h.highlight(HighlightMode.VISIBILITY)
        if (i < line.length) {
          h = this.getH(line[i])
          i++
        }
        else break
      }
    })
    this._map.forEach(h => h.visited = false)
  }

  public findPath(from:Coord, to: Coord): Coord[] {
    const frontier = new PriorityQueue<Coord>()//GridUtils.getNeighbours(from)
    frontier.put(from, 0)
    const path = []
    path[GridUtils.coordToIndex(from)] = null
    const cost = []
    cost[GridUtils.coordToIndex(from)] = 0
    const result = []

    while (frontier.length > 0) {
      const current = frontier.get()

      if (current.equals(to)) {
        const reverseAddToPath = point => {
          const stepIndex = path[GridUtils.coordToIndex(point)]
          if (stepIndex === null) return
          const step = this._map[stepIndex].location
          result.unshift(step)

          if (step.equals(from)) return
          reverseAddToPath(step)
        }
        result.unshift(current)
        reverseAddToPath(current)
        break
      }

      GridUtils.getNeighbours(current).forEach(next => {
        const nextIdx = GridUtils.coordToIndex(next)
        const currentIdx = GridUtils.coordToIndex(current)
        const singleCost = this.getH(next).template.modifiers & Modifiers.NONOBSTRUCTING ? 1 : 1000
        const nextCost = cost[currentIdx] + singleCost
        if (!(nextIdx in cost) || nextCost < cost[nextIdx]) {
          cost[nextIdx] = nextCost
          const priority = nextCost + GridUtils.warpedDistance(to, next).d
          frontier.put(next, priority)
          path[GridUtils.coordToIndex(next)] = currentIdx
        }
      })
    }

    return result
  }

  public drawPath(from: Coord, to: Coord) {
    // this._map.forEach(h => h.deselect())

    const path = this.findPath(from, to)
    if (path.length > 3) return
    path.forEach(p => {
      this.getH(p).highlight(HighlightMode.PATH)
    })
  }

  public redrawVisibility() {
    this._units.forEach(u => {
      if (!u) return
      this.drawVisibility(u.location)
    })
  }
}