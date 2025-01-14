import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { boardProviders } from 'src/board/board.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...boardProviders, SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
