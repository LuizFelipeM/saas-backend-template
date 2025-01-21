import { CryptoUtils } from '@services/common/utils/crypto.utils';
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class Event<D, T = string> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmptyObject()
  data: D;

  type: T;

  private constructor(data: D, type: T) {
    this.data = data;
    this.type = type;
    this.id = CryptoUtils.generateHash(
      JSON.stringify(data),
      type ? JSON.stringify(type) : '',
    );
  }

  static build<T, K = string>(data: T, type: K): Event<T, K> {
    return new Event(data, type);
  }
}
