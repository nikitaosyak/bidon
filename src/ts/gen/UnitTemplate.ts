
namespace gen {
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
    public readonly preved: string[]

    constructor(id: CDBID, name: string, movement: number, range: number, damage: number, health: number, cost: number, affiliation: Affiliation, preved: string[]) {
      this.id = id
      this.name = name
      this.movement = movement
      this.range = range
      this.damage = damage
      this.health = health
      this.cost = cost
      this.affiliation = affiliation
      this.preved = preved
    }
  }
}
namespace gen.UnitTemplate {

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
