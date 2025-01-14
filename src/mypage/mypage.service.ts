import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MypageService {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private authRepository: Repository<AuthEntity>,
  ) {}

  async getMyInfo(body: any): Promise<any> {
    try {
      const myInfo = await this.authRepository
        .createQueryBuilder()
        .select([
          'username',
          'email',
        ])
        .where('id = :id', { id: body.userId })
        .getRawOne();
      
      if (!myInfo) {
        throw new NotFoundException('Cannot find user.');
      }

      return myInfo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get my info.');
    }
  }

  async updateMyInfo(body: any): Promise<any> {
    try {
      const duplication = await this.authRepository
        .createQueryBuilder()
        .select('username')
        .where('username = :username AND id != :id', { 
          username: body.username,
          id: body.userId 
        })
        .getRawMany();

      if (duplication.length > 0) {
        throw new ConflictException('Username already exists.');
      }

      const updateResult = await this.authRepository
        .createQueryBuilder()
        .update()
        .set({ username: body.username })
        .where('id = :id', { id: body.userId })
        .execute();

      if (updateResult.affected === 0) {
        throw new NotFoundException('Cannot find user to update.');
      }

      return updateResult;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update my info.');
    }
  }

  async deleteMyInfo(body: any): Promise<any> {
    try {
      const deleteResult = await this.authRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: body.userId })
        .execute();

      if (deleteResult.affected === 0) {
        throw new NotFoundException('Cannot find user to delete.');
      }

      return deleteResult;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete my info.');
    }
  }
}
