import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { authProviders } from 'src/auth/auth.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MypageController],
  providers: [MypageService, ...authProviders],
  exports: [MypageService],
})
export class MypageModule {}
