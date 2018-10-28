
import {CDBID} from "./base"
export module gen {
  import Modifier = gen.HexTemplate.Modifier

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
export module gen.HexTemplate {

  export enum Modifier {
    WALKABLE,
    NONWALKABLE
  }

  export enum Values {
    fireTile,
    waterTile,
    airTile,
    groundTile,
    mountainTile,
    voidTile
  }

}
