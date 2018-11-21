import {Utils} from "../utils/Utils";
import {HexTemplate} from "../gen/HexTemplate";
import {Facade} from "../Facade";
import {Rules} from "../simulation/Rules";
import seedrandom = require("seedrandom")

export class LandscapeGenerator {

  static weightedRandomLayout(rules: Rules): HexTemplate[] {
    const width = rules.gridWidth,
          height = rules.gridHeight,
          seed = rules.seed,
          weights = rules.weights

    const rngSeq = seedrandom(seed, {global: false})
    const result = []
    const strVariations = Utils.getEnumKeys(HexTemplate.Values)
    const variations = Utils.getEnumOptions(HexTemplate.Values)

    const mapSize = width * height
    const approximatedWeights = weights.map(w => Math.ceil(w * mapSize))
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

    return result.sort((a, b) => -1 + rngSeq() * 2)
  }
}