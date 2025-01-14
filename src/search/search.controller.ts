import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('objekt')
  async searchObjekt(@Body() req: any): Promise<any> {
    return this.searchService.oneToOneSearch(req);
  }

  @Post('mtom')
  async manyToMany(@Body() req: any): Promise<any> {
    console.log(req);
    return this.searchService.manyToMany(req);
  }

  @Post('posting')
  async searchPosting(@Body() req: any): Promise<any> {
    return this.searchService.autoMatching(req);
  }
}
