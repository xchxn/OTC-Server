import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { boardProviders } from './board.providers';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [BoardController],
  providers: [...boardProviders, BoardService],
})
export class BoardModule {}
