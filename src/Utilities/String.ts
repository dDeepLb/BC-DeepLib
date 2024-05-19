import { deepLibLogger } from './Logger';

export class _String {
  static encode(string: string | object) {
    return LZString.compressToBase64(JSON.stringify(string));
  }

  static decode(string: string | undefined) {
    const d = LZString.decompressFromBase64(string as string);
    let data = {};

    try {
      const decoded = JSON.parse(d as string);
      data = decoded;
    } catch (error) {
      deepLibLogger.error(error);
    }
    if (data) return data;
  }

  static shuffle(string: string[]) {
    const temp: string[] = JSON.parse(JSON.stringify(string));
    const ret: string[] = [];
    while (temp.length > 0) {
      const d = Math.floor(Math.random() * temp.length);
      ret.push(temp[d]);
      temp.splice(d, 1);
    }
    return ret;
  }
}
