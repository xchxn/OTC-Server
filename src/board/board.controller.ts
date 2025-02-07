import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
// import { CustomAuthGuard } from 'src/auth/custom-auth.guard';

@SkipThrottle()
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('list')
  getBoardList(): any {
    return this.boardService.getPostingList();
  }

  @Post('myPost')
  getMyPost(@Body() body: any): any {
    return this.boardService.getMyPost(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPosting(
    @Body()
    body: {
      title: string;
      content: string;
      username: string;
      userId: string;
      objekt: {
        have: number[];
        want: number[];
      };
    },
  ): any {
    return this.boardService.createPosting(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  updatePosting(
    @Body()
    body: {
      posting_id: string;
      posting_title: string;
      posting_content: string;
      posting_objekts: string;
    },
  ): any {
    return this.boardService.updatePosting(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  deletePosting(@Body() body: any): any {
    return this.boardService.deletePosting(body.id);
  }

  @SkipThrottle({ default: false })
  @Get('option')
  getSelectOption(): any {
    return this.boardService.getSelectOption();
  }

  @SkipThrottle({ default: false })
  @Post('objekt')
  getTargetObjekt(@Body() body: any): any {
    return this.boardService.getTargetObjekt(body);
  }

  @SkipThrottle({ default: false })
  @Post('thumbnail')
  getThumbnail(@Body() body: any): any {
    return this.boardService.getThumbnail(body);
  }

   // 포스팅의 댓글 가져오기
   @Post('comment/get')
   getComment(@Body() body: any): any {
     return this.boardService.getComment(body);
   }
 
   // 포스팅에 댓글 추가
   @UseGuards(JwtAuthGuard)
   @Post('comment/create')
   createComment(@Body() body: any): any {
     return this.boardService.createComment(body);
   }
 
   // 포스팅 댓글에 대댓글 추가
   @UseGuards(JwtAuthGuard)
   @Post('comment/reply')
   createReply(@Body() body: any): any {
     return this.boardService.createReply(body);
   }
 
   // 포스팅 댓글 개수 조회
   @UseGuards(JwtAuthGuard)
   @Post('comment/getCommentCount')
   getCount(@Body() body: any): any {
     return this.boardService.getCommentCount(body);
   }
 
   // 포스팅 댓글 삭제
   @UseGuards(JwtAuthGuard)
   @Post('comment/delete')
   deleteComment(@Body() body: any): any {
     return this.boardService.deleteComment(body);
   }
 
   // 포스팅 댓글 수정
   @UseGuards(JwtAuthGuard)
   @Post('comment/update')
   updateComment(@Body() body: any): any {
     return this.boardService.updateComment(body);
   }
}
