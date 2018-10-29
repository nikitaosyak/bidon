import {HexTemplate} from "../gen/HexTemplate";

export module grid {

  export class Hexagon {

    private q: number
    private r: number
    private template: HexTemplate

    constructor(q: number, r: number, template:HexTemplate) {
      this.q = q
      this.r = r
      this.template = template
    }
  }
}