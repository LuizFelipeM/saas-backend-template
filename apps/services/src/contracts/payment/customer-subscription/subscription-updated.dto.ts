import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInstance,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CustomerDto } from './customer.dto';
import { EntitlementDto } from './entitlement.dto';
import { SubscriptionStatus } from './subscription-status';
import { UserDto } from './user.dto';

export class SubscriptionUpdatedDto {
  @ValidateIf((o) => !o.customer)
  @IsInstance(UserDto)
  user: UserDto;

  @ValidateIf((o) => !o.user)
  @IsInstance(CustomerDto)
  customer: CustomerDto;

  status?: SubscriptionStatus;

  @IsDate()
  expiresAt?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntitlementDto)
  entitlements: EntitlementDto[];
}
