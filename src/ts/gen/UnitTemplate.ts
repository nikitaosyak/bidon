
import {CDBID} from "./base"
export module gen {
  import Affiliation = gen.UnitTemplate.Affiliation
  import Values = gen.UnitTemplate.Values

  export class UnitTemplate {

    public readonly id: CDBID
    public readonly name: string
    public readonly movement: number
    public readonly range: number
    public readonly damage: number
    public readonly health: number
    public readonly cost: number
    public readonly affiliation: Affiliation

    constructor(id: CDBID, name: string, movement: number, range: number, damage: number, health: number, cost: number, affiliation: Affiliation) {
      this.id = id
      this.name = name
      this.movement = movement
      this.range = range
      this.damage = damage
      this.health = health
      this.cost = cost
      this.affiliation = affiliation
    }
  }
}
export module gen.UnitTemplate {

  export enum Affiliation {
    TERRAIN = "TERRAIN",
    ZERG = "ZERG"
  }

  export enum Values {
    marine = "marine",
    medic = "medic",
    ghost = "ghost",
    zergling = "zergling",
    hydralisk = "hydralisk",
    ultralisk = "ultralisk"
  }

}
