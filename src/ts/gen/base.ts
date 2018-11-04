
export type CDBID = string
export type HEXCOLOR = string

export function intToRGB(value: number): HEXCOLOR { 
  const hex = Number(value).toString(16);
  if (hex === '0') return '#000000'
  return hex.length < 2 ? `#0${hex}` : `#${hex}`;
}

export enum Element {
    FIRE = "FIRE",
    WATER = "WATER",
    AIR = "AIR",
    GROUND = "GROUND",
    NONE = "NONE"
  }
export enum MockupCustomType {
    PRIVET = "PRIVET",
    ANDREY = "ANDREY",
    NU_POZOVI_MENYA_SKOREY = "NU_POZOVI_MENYA_SKOREY"
  }
