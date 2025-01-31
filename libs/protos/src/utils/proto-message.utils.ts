export class ProtoMessageUtils {
  static toMap(obj: { [key: string]: unknown }): { [key: string]: string } {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: JSON.stringify(value) }),
      {},
    );
  }
}
