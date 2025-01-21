import { IsInstance, IsNotEmpty } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { SubscriptionStatus } from './subscription-status';
import { UserDto } from './user.dto';

export class SubscriptionDeletedDto {
  @IsInstance(UserDto)
  user: UserDto;

  @IsInstance(CustomerDto)
  customer: CustomerDto;

  @IsNotEmpty()
  status: SubscriptionStatus;
}
