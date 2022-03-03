export enum WasmSectionType {
  Type = 1,
  Import = 2,
  Function = 3,
  Table = 4,
  Memory = 5,
  Global = 6,
  Export = 7,
  Start = 8,
  Element = 9,
  Code = 10,
  Data = 11
}

export enum WasmValueType {
  i32 = 0x7f,
  i64 = 0x7e,
  f32 = 0x7d,
  f64 = 0x7c
}

export const getWasmValueType = (type: string): WasmValueType => {
  return WasmValueType[Object.keys(WasmValueType).find(key => key === type)]
}

export enum WasmExternalKind {
  Function = 0x0,
  Table = 0x1,
  Memory = 0x2,
  Global = 0x3
}

export const getExternalType = (type: string): WasmExternalKind => {
  return WasmExternalKind[Object.keys(WasmExternalKind).find(key => key === type)]
}

export enum WasmType {
  BlockType = 0x40,
  FunctionType = 0x60,
  TableType = 0x70
  // TODO complete
}
