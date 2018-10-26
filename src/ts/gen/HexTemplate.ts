
namespace gen {
  import Modifier = gen.HexTemplate.Modifier
  import Values = gen.HexTemplate.Values

  export class HexTemplate {

    public readonly id: CDBID
    public readonly element: Element
    public readonly visualmarker: number
    public readonly modifier: Modifier

    constructor(id: CDBID, element: Element, visualmarker: number, modifier: Modifier) {
      this.id = id
      this.element = element
      this.visualmarker = visualmarker
      this.modifier = modifier
    }
  }
}
namespace gen.HexTemplate {

  export enum Modifier {
    WALKABLE = "WALKABLE",
    NONWALKABLE = "NONWALKABLE"
  }

  export enum Values {
    fireTile = "fireTile",
    waterTile = "waterTile",
    airTile = "airTile",
    groundTile = "groundTile",
    mountainTile = "mountainTile",
    voidTile = "voidTile"
  }

}
