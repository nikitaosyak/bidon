import {Utils} from "../utils/Utils";
import {HexTemplate} from "../gen/HexTemplate";
import {Facade} from "../Facade";

export module grid {

  export class LandscapeGenerator {

    private static readonly weights: number[] = [0.3, 0.15, 0.2, 0.15, 0.1, 0.1]

    static weightedRandomLayout(width: number, height: number): HexTemplate[] {
      const result = []
      const strVariations = Utils.getEnumOptionsStr(HexTemplate.Values)
      const variations = Utils.getEnumOptions(HexTemplate.Values)

      const mapSize = width * height
      const approximatedWeights = this.weights.map(w => Math.ceil(w * mapSize))
      const extraTiles = approximatedWeights.reduce((acc, v) => acc + v, 0) - mapSize
      if (extraTiles > 0) {
        for (let i = 0; i < extraTiles; i++) {
          approximatedWeights[i] -= 1
        }
      }

      variations.forEach(v => {
          for (let i = 0; i < approximatedWeights[v]; i++) {
            result.push(Facade.$.cdb.getHexTemplate(strVariations[v]))
          }
      })

      return result.sort((a, b) => -1 + Math.random() * 2)
    }
  }
}