import {CDBID, HEXCOLOR, Element, intToRGB} from "./base"

export class HexTemplate {

  public readonly id: CDBID
  public readonly element: Element
  public readonly visualMarker: HEXCOLOR
  public readonly modifiers: HexTemplate.Modifiers

  constructor(json: any) {
    this.id = json.id as CDBID
    this.element = json.element[0] as Element
    this.visualMarker = intToRGB(json.visualMarker)
    this.modifiers = json.modifiers as number
  }
}

export module HexTemplate {

  export enum Modifiers {
    OBSTRUCTING = 1,
    NONOBSTRUCTING = 2,
    WALKABLE = 4,
    NONWALKABLE = 8
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
