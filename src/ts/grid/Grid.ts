import {LandscapeGenerator} from "./LandscapeGenerator";
import {Coord, GridUtils} from "./GridUtils";
import {Facade} from "../Facade";
import {Hexagon} from "./Hexagon";
import {HexTemplate} from "../gen/HexTemplate";
import {PriorityQueue} from "../utils/PriorityQueue";
import THREE = require("three");
import Modifiers = HexTemplate.Modifiers;

export class Grid {

  private map: Hexagon[]
  private readonly _group: THREE.Group; public get group() { return this._group }

  public getH(c: Coord) : Hexagon { return this.map[GridUtils.coordToIndex(c)] }

  constructor(width: number, height: number) {
    const layout = LandscapeGenerator.weightedRandomLayout('oн hello', width, height)
    GridUtils.init(
      width,
      height,
      (Math.PI*2)/width,
      1.7 / (2*Math.tan(Math.PI/width))
    )

    this.map = []
    this._group = new THREE.Group()

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const h = new Hexagon(q, r, layout[r * width + q])
        this.map.push(h)
        this._group.add(h.visual)
      }
    }

    this._group.position.setY(((height-1)*1.5)/2)
    Facade.$.renderer.scene.add(this._group)
  }

  public selectSingle(target:Coord) {
    this.map.forEach(h => h.deselect())

    this.map[GridUtils.coordToIndex(target)].select()
  }

  public selectNeighbours(target:Coord) {
    this.map.forEach(h => h.deselect())

    GridUtils.getNeighbours(target).forEach(n => {
      this.map[GridUtils.coordToIndex(n)].selectAsNeighbour()
    })
  }

  public drawLine(from:Coord, target:Coord) {
    this.map.forEach(h => h.deselect())

    const line = GridUtils.line(from, target)
    line.forEach(ln => {
      this.map[GridUtils.coordToIndex(ln)].select()
    })
  }

  public drawReach(center:Coord) {
    this.map.forEach(h => h.deselect())
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
          qHex.setReachable(true)
        } else {
          qHex.setReachable(false)
        }
      })
      queue = newQueue
    }
  }

  public drawVisibility(center:Coord) {
    this.map.forEach(h => h.deselect())

    const range = GridUtils.range(center, 3)
    range.forEach(c => {
      let line = GridUtils.line(center, c)
      if (line[line.length-1].equals(center)) line = line.reverse()
      let i = 0, h = this.getH(line[i])
      while ((h.template.modifiers&Modifiers.NONOBSTRUCTING) > 0) {
        h.select()
        if (i < line.length) {
          h = this.getH(line[i])
          i++
        }
        else break
      }
    })
  }

  public findPath(from:Coord, to: Coord): Coord[] {
    this.map.forEach(h => h.visited = false)

    const frontier = new PriorityQueue<Coord>()//GridUtils.getNeighbours(from)
    frontier.put(from, 0)
    const path = []
    path[GridUtils.coordToIndex(from)] = null
    const cost = []
    cost[GridUtils.coordToIndex(from)] = 0
    // this.getH(from).select()
    // this.getH(from).visited = true
    const result = []

    while (frontier.length > 0) {
      const current = frontier.get()

      if (current.equals(to)) {
        const reverseAddToPath = point => {
          const stepIndex = path[GridUtils.coordToIndex(point)]
          if (stepIndex === null) return
          const step = this.map[stepIndex].location
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
        // console.log(cost, nextIdx)
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
    this.map.forEach(h => h.deselect())

    const path = this.findPath(from, to)
    path.forEach(p => {
      this.getH(p).select()
    })
  }
}