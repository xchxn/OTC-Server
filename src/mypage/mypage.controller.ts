import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/myInfo')
  async getMyInfo(@Body() body: any): Promise<any> {
    return this.mypageService.getMyInfo(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myUpdate')
  async updateMyInfo(@Body() body: any): Promise<any> {
    return this.mypageService.updateMyInfo(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myDelete')
  async deleteMyInfo(@Body() body: any): Promise<any> {
    return this.mypageService.deleteMyInfo(body);
  }
}
