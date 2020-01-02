import { Int64 } from "./Int64";

export class BytesReader {

  private pointer: number
  private buffer: Buffer

  constructor(buffer: Buffer) {
    this.buffer = buffer
    this.pointer = 0
  }
  
  readBytes(bytesNumber: number): Buffer {
    const result = this.buffer.slice(this.pointer, bytesNumber + this.pointer)
    this.pointer += bytesNumber
    return result
  }

  readBytesToHex(bytesNumber: number): string {
    const result = this.readBytes(bytesNumber)
    return result.toString('hex')
  }

  readBytesToNumber(bytesNumber: number): number {
    const result = this.readBytesToHex(bytesNumber)
    return parseInt(result, 16)
  }

  readBytesToUtf8String(bytesNumber: number): string {
    const result = this.readBytes(bytesNumber)
    return result.toString('utf8')
  }

  readVarUint32(): number {
    var result = 0
    var shift = 0
    while (true) {
      var byte = parseInt(this.readBytesToHex(1), 16)
      result |= (byte & 0x7F) << shift
      shift += 7
      if ((byte & 0x80) === 0){
        break
      }
    }
    return result
  }

  readVarInt32(): number {
    var result = 0
    var shift = 0
    while (true) {
      var byte = parseInt(this.readBytesToHex(1), 16)
      result |= (byte & 0x7F) << shift
      shift += 7
      if ((byte & 0x80) === 0) {
        break;
      }
    }
    if (shift >= 32) {
      return result
    }
    var ashift = (32 - shift)
    return (result << ashift) >> ashift
  }

  readVarInt64(): number {
    var result = new Uint8Array(8);
    var i = 0;
    var c = 0;
    var shift = 0;
    while (true) {
      var byte = parseInt(this.readBytesToHex(1), 16)
      c |= (byte & 0x7F) << shift;
      shift += 7;
      if (shift > 8) {
        result[i++] = c & 0xFF;
        c >>= 8;
        shift -= 8;
      }
      if ((byte & 0x80) === 0)
        break;
    }
    var ashift = (32 - shift);
    c = (c << ashift) >> ashift;
    while (i < 8) {
      result[i++] = c & 0xFF;
      c >>= 8;
    }
    return new Int64(result).toDouble();
  }

  getPointer(): number {
    return this.pointer
  }

  finished(): boolean {
    return this.pointer >= this.buffer.length
  }
}
