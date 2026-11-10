import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { EmailCampaignController } from './email-campaign.controller';
import { EmailCampaignService } from './email-campaign.service';

@Module({
  imports: [MailModule],
  controllers: [EmailCampaignController],
  providers: [EmailCampaignService, PrismaService],
})
export class EmailCampaignModule {}
