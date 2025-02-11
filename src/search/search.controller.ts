import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { ManyToManyRequestDto, ManyToManyResponseDto } from './dto/search-objekt.dto';
import { SearchPostingRequestDto, SearchPostingResponseDto } from './dto/search-posting.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post('objekt')
  async manyToMany(@Body() req: ManyToManyRequestDto): Promise<ManyToManyResponseDto[]> {
    return this.searchService.manyToMany(req);
  }

  @Post('posting')
  async searchPosting(@Body() req: SearchPostingRequestDto): Promise<SearchPostingResponseDto[]> {
    return this.searchService.autoMatching(req);
  }
}
