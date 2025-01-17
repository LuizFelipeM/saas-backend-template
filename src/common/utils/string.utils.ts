export class StringUtils {
  static kebabize(str: string): string {
    return str.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
