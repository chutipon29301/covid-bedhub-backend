import { ConfigService as NestConfigService } from '@nestjs/config';
import { Env } from '../config';

export class ConfigService extends NestConfigService<Env> {}
