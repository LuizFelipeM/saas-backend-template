import {
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CryptoUtils } from '../../common/utils/crypto.utils';

export class CommandRequest<T, K = undefined> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  data: T;

  type: K;

  static build<TData, KType = undefined>(
    data: TData,
    type: KType,
  ): CommandRequest<TData, KType> {
    const request = new CommandRequest<TData, KType>();
    request.data = data;
    request.type = type;
    request.id = CryptoUtils.generateHash(
      JSON.stringify(data),
      type ? JSON.stringify(type) : '',
    );
    return request;
  }

  response<R>(error: Error): CommandResponse<R>;
  response<R>(data: R): CommandResponse<R>;
  response<R>(data: R | Error): CommandResponse<R> {
    const isError = data instanceof Error;
    return CommandResponse.build(
      this.id,
      !isError,
      isError ? data : undefined,
      !isError ? data : undefined,
    );
  }
}

export class CommandResponse<T> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  success: boolean;

  @ValidateIf((o) => !o.isSuccess)
  @IsInstance(Error)
  error?: Error;

  @ValidateIf((o) => o.isSuccess)
  @IsNotEmptyObject()
  data?: T;

  static build<TData>(
    id: string,
    success: boolean,
    error?: Error,
    data?: TData,
  ) {
    const response = new CommandResponse<TData>();
    response.id = id;
    response.success = success;
    response.error = error;
    response.data = data;
    return response;
  }
}

export class Command {
  static build<T, K = undefined>(data: T, type: K): CommandRequest<T, K> {
    return CommandRequest.build(data, type);
  }
}
