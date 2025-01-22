import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DmModule } from './dm/dm.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { SearchModule } from './search/search.module';
import { ManageModule } from './manage/manage.module';
import { MypageModule } from './mypage/mypage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    BoardModule,
    SearchModule,
    ManageModule,
    MypageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
