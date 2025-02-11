import { Body, Controller, Get, Post } from '@nestjs/common';
import { ManageService } from './manage.service';

@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Post('update')
  async updateObjekt(@Body() body:any): Promise<any> {
    return this.manageService.getObjekt(body);
  }
  
  @Get('getNotice')
  async getNotice(): Promise<any> {
    return this.manageService.getNotice();
  }

  @Post('addNotice')
  async addNotice(@Body() body:any): Promise<any> {
    return this.manageService.addNotice(body);
  }
}
