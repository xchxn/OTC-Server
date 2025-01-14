// import { HttpService } from '@nestjs/axios';
// import { Inject, Injectable } from '@nestjs/common';
// import { lastValueFrom } from 'rxjs';
// import { ObjektEntity } from 'src/board/entities/objekt.entity';
// import { Repository } from 'typeorm';
// import Redis from 'ioredis';

// @Injectable()
// export class ManageService {
//   constructor(
//     @Inject('OBJEKT_REPOSITORY')
//     private objektRepository: Repository<ObjektEntity>,
//     private readonly httpService: HttpService,
//   ) {}

//   redis = new Redis();

//   async getObjekt(): Promise<boolean> {
//     const url = `https://api.cosmo.fans/objekt/v1/token`;
//     const datas: Set<string> = new Set(); // 중복된 collectionId를 확인하기 위한 Set

//     const requests = []; // 모든 요청을 담을 배열

//     for (let i = 100000; i < 150000; i++) {
//       requests.push(this.fetchAndSaveObjekt(url, i, datas));
//     }

//     await Promise.all(requests); // 모든 요청 병렬 처리

//     return true;
//   }

//   private async fetchAndSaveObjekt(
//     url: string,
//     id: number,
//     datas: Set<string>,
//   ) {
//     try {
//       const response = await lastValueFrom(
//         this.httpService.get(`${url}/${id}`),
//       );

//       const collectionId = response.data.objekt.collectionId;

//       if (!datas.has(collectionId)) {
//         datas.add(collectionId);

//         const data = {
//           collectionId: response.data.objekt.collectionId,
//           season: response.data.objekt.season,
//           member: response.data.objekt.member,
//           collectionNo: response.data.objekt.collectionNo,
//           classes: response.data.objekt.class,
//           artists: response.data.objekt.artists[0],
//           thumbnailImage: response.data.objekt.thumbnailImage,
//         };

//         await this.redis.sadd('seasons', data.season);
//         await this.redis.sadd('members', data.member);
//         await this.redis.sadd('collectionNos', data.collectionNo);
//         await this.redis.sadd('classes', data.classes);

//         await this.objektRepository
//           .createQueryBuilder()
//           .insert()
//           .values(data)
//           .execute();
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         console.log(`404 error at ${id}, skipping...`);
//       } else {
//         console.error(`Error at ${id}:`, error.message);
//       }
//     }
//   }
// }

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ObjektEntity } from 'src/board/entities/objekt.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManageService {
  constructor(
    @Inject('OBJEKT_REPOSITORY')
    private readonly objektRepository: Repository<ObjektEntity>,
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

      console.log(`Processed batch starting with ID: ${i}`);
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
        console.log(`404 error at ${id}, skipping...`);
      } else {
        console.error(`Error at ${id}:`, error.message);
      }
    }
  }
}
