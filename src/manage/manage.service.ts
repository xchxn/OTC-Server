import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ObjektEntity } from 'src/board/entities/objekt.entity';
import { Repository } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class ManageService {
  constructor(
    @Inject('OBJEKT_REPOSITORY')
    private readonly objektRepository: Repository<ObjektEntity>,
    @Inject('NOTICE_REPOSITORY')
    private readonly noticeRepository: Repository<NoticeEntity>,
    private readonly httpService: HttpService,
  ) {}

  private readonly MAX_CONCURRENT_REQUESTS = 100; // 시스템에 맞게 조절하세요
  private readonly START_ID = 6000001;
  private readonly END_ID = 6700000;

  async getObjekt(): Promise<boolean> {
    const url = `https://api.cosmo.fans/objekt/v1/token`;
    const processedCollectionIds: Set<string> = new Set();

    for (
      let i = this.START_ID;
      i < this.END_ID;
      i += this.MAX_CONCURRENT_REQUESTS
    ) {
      const batchIds = Array.from(
        { length: Math.min(this.MAX_CONCURRENT_REQUESTS, this.END_ID - i) },
        (_, idx) => i + idx,
      );

      const requests = batchIds.map((id) =>
        this.fetchAndSaveObjekt(url, id, processedCollectionIds),
      );

      await Promise.all(requests); // 현재 배치가 완료될 때까지 대기

    }

    return true;
  }

  private async fetchAndSaveObjekt(
    url: string,
    id: number,
    processedCollectionIds: Set<string>,
  ) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${url}/${id}`),
      );

      const objektData = response.data.objekt;

      if (!objektData) {
        console.warn(`No objekt data found for ID ${id}`);
        return;
      }

      const collectionId = objektData.collectionId;

      if (!processedCollectionIds.has(collectionId)) {
        processedCollectionIds.add(collectionId);

        const data = {
          collectionId: collectionId,
          season: objektData.season,
          member: objektData.member,
          collectionNo: objektData.collectionNo,
          classes: objektData.class,
          artists: objektData.artists[0],
          thumbnailImage: objektData.thumbnailImage,
        };

        await this.objektRepository
          .createQueryBuilder()
          .insert()
          .values(data)
          .execute();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
      } else {
      }
    }
  }

  async addNotice(body:any): Promise<any> {
    const ticket = await this.noticeRepository
      .createQueryBuilder()
      .insert()
      .values(body)
      .execute();
    return ticket;
  }

  async getNotice(): Promise<any> {
    const tickets = await this.noticeRepository
      .createQueryBuilder()
      .select([
        'id',
        'title',
        'content',
      ])
      .orderBy('id', 'DESC')
      .getRawMany();
    return tickets;
  }
}
