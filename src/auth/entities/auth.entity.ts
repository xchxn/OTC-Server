import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  refreshToken: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  kakaoRefreshToken: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  kakaoAccessToken: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleRefreshToken: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleAccessToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true })
  emailConfirmationToken: string;
}
