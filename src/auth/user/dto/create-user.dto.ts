import { IsString } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { OmitType } from '@nestjs/mapped-types';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDto extends OmitType(UpdateUserDto, ['id']) {
  @IsString()
  @Match<CreateUserDto>('password')
  confirmPassword: string;
}
