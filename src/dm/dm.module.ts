import { Module } from '@nestjs/common';
import { DMGateway } from './dm.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DMGateway],
  exports: [DMGateway],
})
export class DmModule {}
