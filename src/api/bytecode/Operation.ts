import { Opcode } from './Opcode'

export interface Operation {
  offset: number
  opcode: Opcode
  argument: any
  begin?: number
  end?: number
  repeated?: number
}
