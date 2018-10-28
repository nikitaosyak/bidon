import {Utils} from "../utils/Utils";
import {HexTemplate} from "../gen/HexTemplate";

export module grid {

  export class LandscapeGenerator {

    private readonly weights: number[] = [0.3, 0.15, 0.2, 0.15, 0.1, 0.1]

    constructor(width: number, height: number) {
      const possibleTypes = Utils.getEnumOptions(HexTemplate.Values)
      console.log(possibleTypes)
    }
  }
}