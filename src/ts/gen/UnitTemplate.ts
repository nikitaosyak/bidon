
namespace gen {
  export enum Affiliation { TERRAIN, ZERG }
  export class UnitTemplate {

    public readonly id: string
    public readonly name: string
    public readonly movement: number
    public readonly range: number
    public readonly damage: number
    public readonly health: number
    public readonly cost: number
    public readonly affiliation: Affiliation
    public readonly preved: string[]

  }
}