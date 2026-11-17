import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { PermissionsGuard } from '../admin/guards/permissions.guard';
import { IJwtPayload } from '../admin/interfaces/admin.interface';
import { EmailCampaignService } from './email-campaign.service';
import {
  AudienceCountDto,
  CreateEmailCampaignDto,
  DeliveriesQueryDto,
  SendTestEmailDto,
  UpdateEmailCampaignDto,
} from './dto/email-campaign.dto';

@ApiTags('Email campaigns')
@ApiBearerAuth()
@RequirePermission('emails.manage')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('email-campaigns')
export class EmailCampaignController {
  constructor(private readonly campaigns: EmailCampaignService) {}

  @Get()
  @ApiOperation({ summary: 'List email campaigns (newest first)' })
  list() {
    return this.campaigns.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create a draft email' })
  create(
    @Body() dto: CreateEmailCampaignDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    return this.campaigns.create(dto, user.sub);
  }

  @Post('audience-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'How many ticket holders match an audience filter',
  })
  audienceCount(@Body() dto: AudienceCountDto) {
    return this.campaigns.audienceCount(dto.audience);
  }

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Render unsaved content with sample values' })
  preview(@Body() dto: CreateEmailCampaignDto) {
    return this.campaigns.preview(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign with delivery stats' })
  get(@Param('id') id: string) {
    return this.campaigns.get(id);
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'Per-recipient delivery results' })
  deliveries(@Param('id') id: string, @Query() query: DeliveriesQueryDto) {
    return this.campaigns.deliveries(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit a draft' })
  update(@Param('id') id: string, @Body() dto: UpdateEmailCampaignDto) {
    return this.campaigns.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draft' })
  remove(@Param('id') id: string) {
    return this.campaigns.remove(id);
  }

  @Post(':id/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a test of the draft to one or more email addresses',
    description:
      'Defaults to your own address. Does not queue or record a campaign delivery.',
  })
  sendTest(
    @Param('id') id: string,
    @Body() dto: SendTestEmailDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    return this.campaigns.sendTest(id, user.sub, dto.emails);
  }

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send the draft to the audience',
    description:
      'Queues one delivery per ticket holder and sends in the background, within the configured mail budget.',
  })
  send(@Param('id') id: string, @CurrentUser() user: IJwtPayload) {
    return this.campaigns.send(id, user.sub);
  }

  @Post(':id/retry-failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Re-queue the failed deliveries' })
  retryFailed(@Param('id') id: string, @CurrentUser() user: IJwtPayload) {
    return this.campaigns.retryFailed(id, user.sub);
  }
}
