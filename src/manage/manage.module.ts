import { Module } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { DatabaseModule } from 'src/database/database.module';
import { boardProviders } from 'src/board/board.providers';
import { HttpModule } from '@nestjs/axios';
import { noticeProviders } from './manage.providers';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [...boardProviders, ManageService, ...noticeProviders],
  controllers: [ManageController],
})
export class ManageModule {}
