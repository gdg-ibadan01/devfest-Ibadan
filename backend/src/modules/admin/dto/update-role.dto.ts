import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
