import { ApiResponseProperty } from '@nestjs/swagger';

class Admin {
  @ApiResponseProperty()
  id!: string;
  @ApiResponseProperty()
  fullName!: string;
  @ApiResponseProperty()
  role!: string;
  @ApiResponseProperty()
  email!: string;
}

export class LoginResponseDto {
  @ApiResponseProperty()
  admin!: Admin;
  @ApiResponseProperty()
  accessToken!: string;
  @ApiResponseProperty()
  refreshToken!: string;
}

export class RefreshTokenResponseDto {
  @ApiResponseProperty()
  accessToken!: string;
  @ApiResponseProperty()
  refreshToken!: string;
}
