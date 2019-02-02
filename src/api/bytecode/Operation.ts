import { Opcode } from './Opcode'
import { BN } from 'bn.js'

export interface Operation {
  offset: number
  opcode: Opcode
  argument: BN
  begin?: number
  end?: number
}
