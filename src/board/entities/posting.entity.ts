// src/post/post.entity.ts
import { AuthEntity } from 'src/auth/entities/auth.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('posting')
export class PostingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => AuthEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: AuthEntity;

  @Column({ length: 100 })
  userId: string;

  @Column('json')
  objekts: { have: number[]; want: number[] }; // 숫자 배열을 JSON으로 저장

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
