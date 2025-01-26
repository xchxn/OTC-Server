import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { PostingEntity } from 'src/board/entities/posting.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @Inject('POSTING_REPOSITORY')
    private postingRepository: Repository<PostingEntity>,
  ) {}
  async manyToMany(body: any): Promise<any> {
    const queryBuilder = this.postingRepository
      .createQueryBuilder()
      .select('id');

    const haveIds = body.objekts.have.map((obj) => obj.id);
    const wantIds = body.objekts.want.map((obj) => obj.id);

    if (Array.isArray(haveIds) && Array.isArray(wantIds)) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where(
            `(SELECT COUNT(*) FROM JSON_TABLE(objekts->'$.have', '$[*]' COLUMNS(value INT PATH '$')) h 
               WHERE h.value IN (:...wantIds)) > 0
             AND 
             (SELECT COUNT(*) FROM JSON_TABLE(objekts->'$.want', '$[*]' COLUMNS(value INT PATH '$')) w 
               WHERE w.value IN (:...haveIds)) > 0`,
            { wantIds, haveIds }
          );
        }),
      );
    }

    const oneSearch = await queryBuilder.getRawMany();

    const ids = oneSearch.map((r) => r.id);

    if (ids.length === 0) {
      return []; // ids가 비어 있으면 빈 배열 반환
    }

    const resPostingList = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect(AuthEntity, 'auth', 'auth.id = posting.userId')
      .select([
        'posting.id',
        'posting.title',
        'posting.userId',
        'posting.content',
        'posting.objekts',
        'posting.createdAt',
        'posting.updatedAt',
        'auth.username',
      ])
      .where('posting.id IN (:...ids)', { ids })
      .getRawMany();

    return resPostingList;
  }

  // 게시글 기반으로 want와 have 하나씩 비교해서 일치하는 것 있으면 반환
  async autoMatching(body: any): Promise<any> {
    // 자신의 포스팅 개수 확인하기
    const myPostingCount = await this.postingRepository
      .createQueryBuilder('posting')
      .where('userId = :userId', { userId: body.user })
      .getCount();

    if (myPostingCount > 1) {
      throw new BadRequestException('Your posting is more than one. Please makes your posting only one.');
    }

    // 자신의 포스팅에서 오브젝트 want배열 가져오기
    const getWantArr = await this.postingRepository
      .createQueryBuilder('posting')
      .select('JSON_EXTRACT(posting.objekts, "$.want")', 'wantArray')
      .where('userId = :userId', { userId: body.user })
      .getRawOne();

    // Have 배열 가져오기
    const getHaveArr = await this.postingRepository
      .createQueryBuilder('posting')
      .select('JSON_EXTRACT(posting.objekts, "$.have")', 'haveArray')
      .where('userId = :userId', { userId: body.user })
      .getRawOne();

    // 위에서 가져온 want배열로 매칭
    const queryBuilder = this.postingRepository
      .createQueryBuilder('posting')
      .select('id');


    if (Array.isArray(getHaveArr.haveArray) && Array.isArray(getWantArr.wantArray)) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where(
            `(SELECT COUNT(*) FROM JSON_TABLE(objekts->'$.have', '$[*]' COLUMNS(value INT PATH '$')) h 
               WHERE h.value IN (:...wantArray)) > 0
             AND 
             (SELECT COUNT(*) FROM JSON_TABLE(objekts->'$.want', '$[*]' COLUMNS(value INT PATH '$')) w 
               WHERE w.value IN (:...haveArray)) > 0`,
            { wantArray: getWantArr.wantArray, haveArray: getHaveArr.haveArray }
          );
        }),
      );
    }

    const result = await queryBuilder.getRawMany();

    const ids = result.map((r) => r.id);

    const resPostingList = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect(AuthEntity, 'auth', 'auth.id = posting.userId')
      .select([
        'posting.id',
        'posting.title',
        'posting.userId',
        'posting.content',
        'posting.objekts',
        'posting.createdAt',
        'posting.updatedAt',
        'auth.username',
      ])
      .where('posting.id IN (:...ids)', { ids })
      .getRawMany();
    return resPostingList;
  }
}
