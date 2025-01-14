import { DataSource } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AuthEntity),
    inject: ['DATA_SOURCE'],
  },
];
