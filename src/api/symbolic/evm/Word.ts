import { BN } from 'bn.js'
import { Symbols } from './Symbols'

export class Word {
  static WORD_LENGTH_IN_BYTES = 32

  isSymbolic: boolean
  value?: BN
  symbol?: Symbols

  static createLiteral(valueHex: string): Word {
    return { isSymbolic: false, value: new BN(valueHex, 16) } as Word
  }

  static createSymbolic(symbol: Symbols): Word {
    return { isSymbolic: true, symbol: symbol } as Word
  }
}
