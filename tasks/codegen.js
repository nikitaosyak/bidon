const capitalize = v => v[0].toUpperCase() + v.slice(1)
const getTypeId = typeStr => typeStr.split(':')[0]
const getRefType = typeStr => typeStr.split(':')[1]
const getColumnType = (gameData, sheet, column) => {
  switch(getTypeId(column.typeStr)) {
    case '0' : return 'CDBID'
    case '1' : return 'string'
    case '2' : return 'boolean'
    case '3' : return 'number'
    case '4' : return 'number'
    case '5' : return `${capitalize(column.name)}`
    case '6': case '9': return getRefType(column.typeStr)

    case '8' :
      const typeRegex = `${sheet.name}@${column.name}`
      const typeDescription = gameData.sheets
        .find(sheet => new RegExp(typeRegex).test(sheet.name))
        .columns[0]
      return `${getColumnType(gameData, sheet, typeDescription)}[]`

    case '11': return 'number' // really color
    default  : return 'UNKNOWN TYPE'
  }
}

module.exports = () => {
  return new Promise(resolve => {
    const fs = require('fs')
    const rimraf = require('rimraf')

    if (fs.existsSync('src/ts/gen')) {
      rimraf.sync('src/ts/gen')
    }
    fs.mkdirSync('src/ts/gen')

    //
    // load game data
    const gameData = JSON.parse(fs.readFileSync('gameData/gameData.cdb', 'utf8'))

    //
    // create custom types
    const allEnums = gameData.customTypes.map(customEnum => {
      const enumCasesSource = customEnum.cases
        .map(singleCase => `    ${singleCase.name} = "${singleCase.name}"`)
        .join(',\n')
      return `  export enum ${customEnum.name} {\n${enumCasesSource}\n  }`
    }).join('\n')

    const customTypesSource = `
export type CDBID = string
export module gen {
  

${allEnums}
}`

    fs.writeFileSync('src/ts/gen/base.ts', customTypesSource, 'utf8')

    //
    // create sheet types
    gameData.sheets
      .filter(sheet => !/^.*@.*$/.test(sheet.name))
      .forEach(sheet => {
        const classEnums = sheet.columns
          .filter(column => column.typeStr[0] === '5')
          .map(column => {
            const options = column.typeStr.split(':')[1].split(',').map(o => `    ${o}`)
            return `  export enum ${capitalize(column.name)} {\n${options.join(',\n')}\n  }`
          }).join('\n')
        let imports = []
        if (classEnums.length > 0) {
          imports = sheet.columns
            .filter(column => column.typeStr[0] === '5')
            .map(column => `  import ${capitalize(column.name)} = gen.${sheet.name}.${capitalize(column.name)}`)
        }

        const fieldStore = sheet.columns.map(col => [col.name.toLowerCase(), getColumnType(gameData, sheet, col)])
        const fields = fieldStore.map(f => `    public readonly ${f[0]}: ${f[1]}`).join('\n')
        const args = fieldStore.map(f => `${f[0]}: ${f[1]}`).join(', ')
        const assign = fieldStore.map(f => `      this.${f[0]} = ${f[0]}`).join('\n')

        const valuesEnum = `  export enum Values {\n${sheet.lines.map(line => `    ${line.id}`).join(',\n')}\n  }`

        const sheetTypeSource = `
import {CDBID} from "./base"
export module gen {
${imports.join('\n')}

  export class ${sheet.name} {

${fields}

    constructor(${args}) {
${assign}
    }
  }
}
export module gen.${sheet.name} {

${classEnums}

${valuesEnum}

}
`
      fs.writeFileSync(`src/ts/gen/${sheet.name}.ts`, sheetTypeSource, 'utf8')
    })

    //
    // create main cdb class

    gameData.sheets
      .filter(sheet => !/^.*@.*$/.test(sheet.name))
      // .map(sheet => )

    const cdbSource = `
export module gen {
  export class CDB {
    public readonly data:object
    
    // fields
    
    // ctor
    constructor(rawData:string) {
      this.data = JSON.parse(rawData)
    }
  }
}`
    fs.writeFileSync(`src/ts/gen/CDB.ts`, cdbSource, 'utf8')

    resolve()
  })
}