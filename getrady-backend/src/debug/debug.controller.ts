import { Controller, Get } from '@nestjs/common';

@Controller('debug')
export class DebugController {
  @Get('error')
  boom() {
    throw new Error('Debug 500');
  }
}