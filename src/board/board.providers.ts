import { DataSource } from 'typeorm';
import { ObjektEntity } from './entities/objekt.entity';
import { PostingEntity } from './entities/posting.entity';
import { CommentEntity } from './entities/comment.entity';

export const boardProviders = [
  {
    provide: 'OBJEKT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ObjektEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'POSTING_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PostingEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COMMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CommentEntity),
    inject: ['DATA_SOURCE'],
  },
];
