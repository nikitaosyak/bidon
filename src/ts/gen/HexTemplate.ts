import {CDBID, HEXCOLOR, Element, intToRGB} from "./base"

export class HexTemplate {

  public readonly id: CDBID
  public readonly element: Element
  public readonly visualMarker: HEXCOLOR
  public readonly modifier: HexTemplate.Modifier

  constructor(json: any) {
    this.id = json.id as CDBID
    this.element = json.element[0] as Element
    this.visualMarker = intToRGB(json.visualMarker)
    this.modifier = json.modifier as HexTemplate.Modifier
  }
}

export module HexTemplate {

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
