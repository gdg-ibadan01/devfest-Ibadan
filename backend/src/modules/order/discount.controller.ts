import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import {
  CreateDiscountDto,
  CreateDiscountResponseDto,
  DiscountByCodeResponseDto,
  DiscountListQueryDto,
  DiscountListResponseDto,
  UpdateDiscountDto,
} from './dto/discount.dto';
import { DiscountsService } from './discount.service';

@ApiTags('Discount')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @ApiBearerAuth()
  @RequirePermission('discounts.list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'List discounts',
    description:
      'Cursor-paginated list of discounts. Optionally filter by name.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Discounts retrieved successfully',
    type: DiscountListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires permission',
  })
  findAll(@Query() query: DiscountListQueryDto) {
    return this.discountsService.list(query);
  }

  @Get('code/:discountCode')
  @ApiOperation({ summary: 'Get discount amount' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Discount found',
    type: DiscountByCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Discount not found',
  })
  findByCode(@Param('discountCode') discountCode: string) {
    return this.discountsService.findByCode(discountCode);
  }

  @Post()
  @ApiBearerAuth()
  @RequirePermission('discounts.create')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a discount' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Discount created successfully',
    type: CreateDiscountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires permission',
  })
  async create(@Body() payload: CreateDiscountDto) {
    try {
      return await this.discountsService.create(payload);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':discountId')
  @ApiBearerAuth()
  @RequirePermission('discounts.update')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'Update discount valid_to',
    description:
      'Updates the expiry date of a discount. Set validTo to null to clear it, or omit it to leave it unchanged.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Discount updated successfully',
    type: CreateDiscountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires permission',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Discount not found',
  })
  async updateDiscount(
    @Param('discountId') discountId: string,
    @Body() payload: UpdateDiscountDto,
  ) {
    try {
      return await this.discountsService.updateDiscount(discountId, payload);
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
