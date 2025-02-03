import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export class GrpcUtils {
  static getProtoPaths(path: string): string[] {
    const protoServicesDir = join(__dirname, path);
    return readdirSync(protoServicesDir)
      .filter((file) => file.endsWith('.proto'))
      .map((file) => join(protoServicesDir, file));
  }
}
