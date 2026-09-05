import { Module } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeController } from './attendee.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AttendeeController],
  providers: [AttendeeService, PrismaService],
  exports: [AttendeeService],
})
export class AttendeeModule {}
