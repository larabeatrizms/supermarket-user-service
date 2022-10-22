import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ role: 'user', cmd: 'ping' })
  ping() {
    return {
      test: 'Hello',
    };
  }
}
