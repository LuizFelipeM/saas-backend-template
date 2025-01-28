import { createHash } from 'node:crypto';

export class CryptoUtils {
  static generateHash(...strs: string[]): string {
    const md5sum = createHash('md5');
    for (const str of strs) {
      md5sum.update(str);
    }
    return md5sum.digest('hex');
  }
}
