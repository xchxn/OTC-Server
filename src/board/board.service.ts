import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostingEntity } from './entities/posting.entity';
import { ObjektEntity } from './entities/objekt.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { CommentEntity } from './entities/comment.entity';
@Injectable()
export class BoardService {
  constructor(
    @Inject('POSTING_REPOSITORY')
    private postingRepository: Repository<PostingEntity>,
    @Inject('OBJEKT_REPOSITORY')
    private objektRepository: Repository<ObjektEntity>,
    @Inject('COMMENT_REPOSITORY')
    private commentRepository: Repository<CommentEntity>,
    // @Inject('AUTH_REPOSITORY')
    // private authRepository: Repository<AuthEntity>,
  ) {}

  // 모든 포스팅 목록, 보드 채우기
  async getPostingList(): Promise<any> {
    const getPostingList = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect(AuthEntity, 'auth', 'auth.id = posting.userId')
      .select([
        'posting.id',
        'posting.userId',
        'posting.title',
        'posting.content',
        'posting.objekts',
        'posting.createdAt',
        'posting.updatedAt',
        'auth.username',
      ])
      .addSelect((subQuery) => {
        return subQuery
        .select('COUNT(*)')
        .from(CommentEntity, 'comment')
        .where('comment.postingId = posting.id')
    },'commentCount')
      .getRawMany();
    // console.log(getPostingList);
    return getPostingList;
  }

  async getMyPost(body: any): Promise<any> {
    const myPost = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect(AuthEntity, 'auth', 'auth.id = posting.userId')
      .select([
        'posting.id',
        'posting.userId',
        'posting.title',
        'posting.content',
        'posting.objekts',
        'posting.createdAt',
        'posting.updatedAt',
        'auth.username',
      ])
      .addSelect((subQuery) => {
        return subQuery
        .select('COUNT(*)')
        .from(CommentEntity, 'comment')
        .where('comment.postingId = posting.id')
    },'commentCount')
      .where('userId = :userId', { userId: body.userId })
      .getRawMany();
    console.log(myPost);
    return myPost;
  }

  // 포스팅 생성
  async createPosting(body: any): Promise<any> {
    const createTicket = await this.postingRepository
      .createQueryBuilder()
      .insert()
      .values({
        title: body.title,
        content: body.content,
        userId: body.userId,
        objekts: {
          have: body.objekt.have,
          want: body.objekt.want,
        },
      })
      .execute();
    return createTicket;
  }

  // 포스팅 수정
  async updatePosting(body: any): Promise<any> {
    const updateTicket = await this.postingRepository
      .createQueryBuilder()
      .update()
      .set({
        title: body.posting_title,
        content: body.posting_content,
        objekts: body.posting_objekts,
      })
      .where('id = :id', { id: body.posting_id })
      .execute();
    return updateTicket;
  }

  // 포스팅 삭제
  async deletePosting(body: any): Promise<any> {
    console.log(body);
    const deleteTicket = await this.postingRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: body.posting_id })
      .execute();
    return deleteTicket;
  }

  // 오브젝트 선택 옵션 제공
  async getSelectOption(): Promise<any> {
    const season = await this.objektRepository
      .createQueryBuilder()
      .select('DISTINCT season', 'season')
      .getRawMany();
    const member = await this.objektRepository
      .createQueryBuilder()
      .select('DISTINCT member', 'member')
      .getRawMany();
    const collectionNO = await this.objektRepository
      .createQueryBuilder()
      .select('DISTINCT collectionNO', 'collectionNO')
      .orderBy('collectionNO', 'ASC')
      .getRawMany();
    const getClass = await this.objektRepository
      .createQueryBuilder()
      .select('DISTINCT classes', 'classes')
      .getRawMany();
    // 각각의 결과를 배열로 변환
    const seasonArray = season.map((item) => item.season);
    const memberArray = member.map((item) => item.member);
    const collectionNOArray = collectionNO.map((item) => item.collectionNO);
    const getClassArray = getClass.map((item) => item.classes);

    const options = {
      season: seasonArray,
      member: memberArray,
      collectionNo: collectionNOArray,
      classes: getClassArray,
    };

    return options;
  }

  // 선택 오브젝트의 아이디와 썸네일 주소 반환
  async getTargetObjekt(body: any): Promise<any> {
    const selectOption = await this.objektRepository
      .createQueryBuilder()
      // .select('DISTINCT id', 'id')
      .where('season = :season', { season: body.season })
      .andWhere('member = :member', { member: body.member })
      .andWhere('collectionNo = :collectionNo', {
        collectionNo: body.collectionNo,
      })
      .andWhere('classes = :classes', { classes: body.classes })
      .getOne();
    if (!selectOption) {
      throw new Error('No matching object found for the provided criteria.');
    }
    return selectOption;
  }

  async getThumbnail(body: any): Promise<any> {
    // console.log(body);
    const selectOption = await this.objektRepository
      .createQueryBuilder('')
      // .select('DISTINCT thumbnailImage', 'thumbnailImage')
      // .select()
      .where('id = :id', { id: body.id })
      .getOne();
    // console.log(selectOption);
    return selectOption;
  }

   // 포스팅의 댓글 가져오기
   async getComment(body: any): Promise<any> {
    console.log(body);
    const getComment = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect(AuthEntity, 'auth', 'auth.id = comment.userId')
      .select([
        'comment.id',
        'comment.posting_id',
        'comment.userId',
        'comment.replyTargetCommentId',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'auth.username',
      ])
      .where('comment.posting_id = :posting_id', { posting_id: body.posting_id })
      .getRawMany();
    console.log(getComment);
    return getComment;
  }

  // 포스팅에 댓글 추가
  async createComment(body: any): Promise<any> {
    const commentTicket = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .values({
        posting_id: body.posting_id,
        userId: body.userId,
        content: body.content,
      })
      .execute();
    return commentTicket;
  }

  // 포스팅 댓글에 대댓글 추가
  async createReply(body: any): Promise<any> {
    console.log(body);
    const replyTicket = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .values({
        posting_id: body.posting_id,
        userId: body.userId,
        content: body.content,
        replyTargetCommentId: body.replyTargetCommentId,
      })
      .execute();
    return replyTicket;
  }

  // 포스팅 댓글 개수 조회
  async getCommentCount(body: any): Promise<any> {
    const commentCount = await this.commentRepository
      .createQueryBuilder()
      .where('posting_id = :posting_id', { posting_id: body.posting_id })
      .getCount();
    return commentCount;
  }

  // 포스팅 댓글 삭제
  async deleteComment(body: any): Promise<any> {
    const commentDelete = await this.commentRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: body.comment_id })
      .execute();
    return commentDelete;
  }

  // 포스팅 댓글 수정
  async updateComment(body: any): Promise<any> {
    const commentUpdate = await this.commentRepository
      .createQueryBuilder()
      .update()
      .set({ content: body.content })
      .where('id = :id', { id: body.comment_id })
      .execute();
    return commentUpdate;
  }
}
