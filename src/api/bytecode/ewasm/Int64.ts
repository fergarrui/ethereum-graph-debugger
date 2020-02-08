export class Int64 {

  private _data: Uint8Array;

  constructor (data) {
    this._data = data || new Uint8Array(8);
  }
  
  public toInt32(): number {
    return this._data[0] | (this._data[1] << 8) | (this._data[2] << 16) | (this._data[3] << 24);
  }
  
  public toDouble(): number {
    var power = 1;
    var sum;
    if (this._data[7] & 0x80) {
      sum = -1;
      for (var i = 0; i < 8; i++, power *= 256)
        sum -= power * (0xFF ^ this._data[i]);
    } else {
      sum = 0;
      for (var i = 0; i < 8; i++, power *= 256)
        sum += power * this._data[i];
    }
    return sum;
  }
  
}
