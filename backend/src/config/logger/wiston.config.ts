import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptionsFactory } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  useFactory: (configService: ConfigService) => ({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  }),
  inject: [ConfigService],
  imports: [],
};
