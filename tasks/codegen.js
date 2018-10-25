
const SPECIAL_TYPES = { ENUM: 'ENUM' }
const capitalize = v => v[0].toUpperCase() + v.slice(1)
const getTypeId = typeStr => typeStr.split(':')[0]
const getRefType = typeStr => typeStr.split(':')[1]
const getColumnType = (gameData, column) => {
  switch(getTypeId(column.typeStr)) {
    case '0' :
    case '1' : return 'string'
    case '2' : return 'boolean'
    case '3' : return 'number'
    case '4' : return 'number'
    case '5' : return `${capitalize(column.name)}`
    case '6': case '9': return getRefType(column.typeStr)

    case '8' :
      const typeRegex = `UnitTemplate@${column.name}`
      const typeDescription = gameData.sheets
        .filter(sheet => new RegExp(typeRegex).test(sheet.name))[0]
        .columns[0]
      return `${getColumnType(gameData, typeDescription)}[]`

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
        .map(singleCase => `${singleCase.name}`)
        .join(', ')
      return `  export enum ${customEnum.name} { ${enumCasesSource} }`
    }).join('\n')

    const customTypesSource = `\nnamespace gen {\n${allEnums}\n}`

    fs.writeFileSync('src/ts/gen/custom_types.ts', customTypesSource, 'utf8')


    //
    // create sheet types

    gameData.sheets
      .filter(sheet => !/UnitTemplate@.*$/.test(sheet.name))
      .forEach(sheet => {
        const classEnums = sheet.columns
          .filter(column => column.typeStr[0] === '5')
          .map(column => {
            const options = column.typeStr.split(':')[1].split(',')
            return `  export enum ${capitalize(column.name)} { ${options.join(', ')} }`
          }).join('\n')

        const fieldsSource = sheet.columns
          .map(column =>
            `    public readonly ${column.name.toLowerCase()}: ${getColumnType(gameData, column)}`
          ).join('\n')


      const sheetTypeSource = `\nnamespace gen {
${classEnums}
  export class ${sheet.name} {

${fieldsSource}

  }
}`
      fs.writeFileSync(`src/ts/gen/${sheet.name}.ts`, sheetTypeSource, 'utf8')
    })

    resolve()
  })
}