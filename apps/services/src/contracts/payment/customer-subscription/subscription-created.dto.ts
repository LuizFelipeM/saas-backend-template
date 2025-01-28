import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInstance,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CustomerDto } from './customer.dto';
import { EntitlementDto } from './entitlement.dto';
import { SubscriptionStatus } from './subscription-status';
import { UserDto } from './user.dto';

export class SubscriptionCreatedDto {
  @IsInstance(UserDto)
  user: UserDto;

  @IsInstance(CustomerDto)
  customer: CustomerDto;

  @IsNotEmpty()
  status: SubscriptionStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntitlementDto)
  entitlements: EntitlementDto[];

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;
}
