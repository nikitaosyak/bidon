import {CDBID, HEXCOLOR, Element, intToRGB} from "./base"

export class UnitTemplate {

  public readonly id: CDBID
  public readonly name: string
  public readonly movement: number
  public readonly range: number
  public readonly damage: number
  public readonly health: number
  public readonly cost: number
  public readonly affiliation: UnitTemplate.Affiliation

  constructor(json: any) {
    this.id = json.id as CDBID
    this.name = json.name as string
    this.movement = json.movement as number
    this.range = json.range as number
    this.damage = json.damage as number
    this.health = json.health as number
    this.cost = json.cost as number
    this.affiliation = json.affiliation as UnitTemplate.Affiliation
  }
}

export module UnitTemplate {

  export enum Affiliation {
    TERRAIN,
    ZERG
  }


  export enum Values {
    marine,
    medic,
    ghost,
    zergling,
    hydralisk,
    ultralisk
  }

}
