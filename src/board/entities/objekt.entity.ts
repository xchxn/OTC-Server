import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ObjektEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  collectionId: string;

  @Column({ type: 'varchar', length: 255 })
  season: string;

  @Column({ type: 'varchar', length: 255 })
  member: string;

  @Column({ type: 'varchar', length: 255 })
  collectionNo: string;

  @Column({ type: 'varchar', length: 255 })
  classes: string;

  @Column({ type: 'varchar', length: 255 })
  thumbnailImage: string;
}
