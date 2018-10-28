const decapitalize = v => v[0].toLowerCase() + v.slice(1)
const capitalize = v => v[0].toUpperCase() + v.slice(1)
const getTypeId = typeStr => typeStr.split(':')[0]
const getRefType = typeStr => typeStr.split(':')[1]
const getColumnType = (gameData, sheet, column) => {
  switch(getTypeId(column.typeStr)) {
    case '0' : return 'CDBID'
    case '1' : return 'string'
    case '2' : return 'boolean'
    case '3' :
    case '4' : return 'number'
    case '5' : return `${sheet.name}.${capitalize(column.name)}`
    case '6':
    case '9': return getRefType(column.typeStr)

    case '8' :
      const typeRegex = `${sheet.name}@${column.name}`
      const typeDescription = gameData.sheets
        .find(sheet => new RegExp(typeRegex).test(sheet.name))
        .columns[0]
      return `${getColumnType(gameData, sheet, typeDescription)}[]`

    case '11': return 'HEXCOLOR'
    default  : return 'UNKNOWN TYPE'
  }
}

const getColumnCast = (gameData, sheet, column, v) => {
  switch(getTypeId(column.typeStr)) {
    case '0' : return `${v} as CDBID`
    case '1' : return `${v} as string`
    case '2' : return `${v} as boolean`
    case '3' :
    case '4' : return `${v} as number`
    case '5' : return `${v} as ${getColumnType(gameData, sheet, column)}`
    case '6' : return `${v} /*TODO: ref type is unsupported :(*/`
    case '7' : return `${v} /*TODO: image type is unsupported*/`
    case '8' : return `${v} /*TODO: check array type support*/`
    case '9' : return `${v}[0] as ${getColumnType(gameData, sheet, column)}`
    case '11': return `intToRGB(${v})`
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
      return `export enum ${customEnum.name} {\n${enumCasesSource}\n  }`
    }).join('\n')

    const customTypesSource = `
export type CDBID = string
export type HEXCOLOR = string

export function intToRGB(value: number): HEXCOLOR { 
  const hex = Number(value).toString(16);
  return hex.length < 2 ? \`#0\${hex}\` : \`#\${hex}\`;
}

${allEnums}
`

    fs.writeFileSync('src/ts/gen/base.ts', customTypesSource, 'utf8')

    //
    // create sheet types
    gameData.sheets
      .filter(s => !/^.*@.*$/.test(s.name))
      .forEach(sheet => {
        const classEnums = sheet.columns
          .filter(column => column.typeStr[0] === '5')
          .map(column => {
            const options = column.typeStr.split(':')[1].split(',').map(o => `    ${o}`)
            return `  export enum ${capitalize(column.name)} {\n${options.join(',\n')}\n  }`
          }).join('\n')
        let imports = []
        // if (classEnums.length > 0) {
        //   imports = sheet.columns
        //     .filter(column => column.typeStr[0] === '5')
        //     .map(column => `  import ${capitalize(column.name)} = ${sheet.name}.${capitalize(column.name)}`)
        // }
        const fieldStore = sheet.columns.map(col => [decapitalize(col.name), getColumnType(gameData, sheet, col)])
        const fields = fieldStore.map(f => `  public readonly ${f[0]}: ${f[1]}`).join('\n')
        const assign = fieldStore.map((f, i) => {
          const column = sheet.columns[i]
          return `    this.${f[0]} = ${getColumnCast(gameData, sheet, column, 'json.' + f[0])}`
        }).join('\n')

        const valuesEnum = `  export enum Values {\n${sheet.lines.map(line => `    ${line.id}`).join(',\n')}\n  }`

        const sheetTypeSource = `import {CDBID, HEXCOLOR, Element, intToRGB} from "./base"
${imports.join('\n')}
export class ${sheet.name} {

${fields}

  constructor(json: any) {
${assign}
  }
}

export module ${sheet.name} {

${classEnums}

${valuesEnum}

}
`
      fs.writeFileSync(`src/ts/gen/${sheet.name}.ts`, sheetTypeSource, 'utf8')
    })

    //
    // create main cdb class

    const fieldStore = gameData.sheets.filter(s => !/^.*@.*$/.test(s.name)).map(s => [decapitalize(s.name), s.name])
    const imports = fieldStore.map(f => `import {${f[1]}} from "./${f[1]}";`).join('\n')
    const storages = fieldStore.map(f => `  private ${f[0]}Storage : object = {}`).join('\n')
    const valueGetters = fieldStore.map(f => `  public get${f[1]}(key: CDBID): ${f[1]} { return this.${f[0]}Storage[key] }`).join('\n')
    const creators = fieldStore.map(f => `  private create${f[1]}(json: any):${f[1]} { return new ${f[1]}(json) }`).join('\n')

    const cdbSource = `import {CDBID} from "./base";
${imports}

export class CDB {
  public readonly data:any
  
${storages}

${creators}

${valueGetters}
  
  // ctor
  constructor(rawData:string) {
    this.data = JSON.parse(rawData)
    
    this.data.sheets.forEach(sheet => {
      const storage = this[\`\${sheet.name[0].toLowerCase()}\${sheet.name.slice(1)}Storage\`]
      sheet.lines.forEach(line => {
        storage[line.id] = this[\`create\${sheet.name}\`](line)
      })
    })
  }
}
`
    fs.writeFileSync(`src/ts/gen/CDB.ts`, cdbSource, 'utf8')

    resolve()
  })
}