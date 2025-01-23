import { DataSource } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';

export const noticeProviders = [
  {
    provide: 'NOTICE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(NoticeEntity),
    inject: ['DATA_SOURCE'],
  }
];
