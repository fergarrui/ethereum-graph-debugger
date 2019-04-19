let BN = require('bn.js')

export class UintUtils {
  static TWO_POW_256 = new BN('10000000000000000000000000000000000000000000000000000000000000000', 16)
  static ZERO = new BN('00', 16)
  static ONE = new BN('01', 16)
}
