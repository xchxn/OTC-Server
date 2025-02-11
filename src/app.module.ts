import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DmModule } from './dm/dm.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { SearchModule } from './search/search.module';
import { ManageModule } from './manage/manage.module';
import { MypageModule } from './mypage/mypage.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    BoardModule,
    SearchModule,
    ManageModule,
    MypageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
