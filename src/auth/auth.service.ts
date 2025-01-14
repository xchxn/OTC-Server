import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/auth.dto';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  private saltOrRounds = 10;

  constructor(
    @Inject('AUTH_REPOSITORY')
    private authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('EMAIL_HOST'),
      port: parseInt(configService.get<string>('EMAIL_PORT'), 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: configService.get<string>('EMAIL_USER'), // 이메일 계정
        pass: configService.get<string>('EMAIL_PASS'), // 이메일 비밀번호
      },
    });
  }

  async register(req: SignUpDto): Promise<any> {
    const existingUser = await this.authRepository.findOne({
      where: { id: req.id },
    });

    const existingUsername = await this.authRepository.findOne({
      where: { username: req.username },
    });

    if (existingUser || existingUsername) {
      throw new BadRequestException('ID or username already in use.');
    }

    const emailConfirmationToken = randomBytes(16).toString('hex');

    // JWT 인증 토큰 발급 추가
    const register = await this.authRepository
      .createQueryBuilder()
      .insert()
      .values({
        id: req.id,
        email: req.email,
        username: req.username,
        password: await bcrypt.hash(req.password, this.saltOrRounds),
        emailConfirmationToken: emailConfirmationToken,
      })
      .execute();

    // 이메일 전송 후 토큰 확인 로직까지 추가 요망
    await this.sendEmail(req.email, req.username, emailConfirmationToken);
    return true;
  }

  async sendEmail(to: string, subject: string, token: string): Promise<any> {
    const mailOptions = {
      // from: '"Example Team" <example@example.com>',
      to: to,
      subject: subject,
      text: 'Please confirm your email for service.',
      html: `Click here to confirm your email: 
        <a href="${this.configService.get<string>('SERVER_URL')}/auth/confirm/${token}">Confirm Email</a>`,
    };

    const info = await this.transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
  }

  async confirmEmail(token: string): Promise<void> {
    const user = await this.authRepository.findOne({
      where: { emailConfirmationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token is invalid.');
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;

    await this.authRepository.save(user);
  }

  async login(req: any): Promise<any> {
    const login = await this.authRepository
      .createQueryBuilder()
      .select()
      .where('id = :id', { id: req.id })
      .getOne();
    if (login === null) {
      throw new Error('There is no login information, register first please');
    }
    if (!login.isEmailConfirmed) {
      throw new Error(
        'Email not confirmed. Please check your email to confirm your account.',
      );
    }
    const check = await bcrypt.compare(req.password, login.password);
    if (check) {
      // JWT 인증 토큰 발급 추가
      const payload = { sub: login.id, username: login.username };

      login.accessToken = await this.jwtService.signAsync(payload);
      login.refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      await this.authRepository.save(login);

      return {
        accessToken: login.accessToken,
        refreshToken: login.refreshToken,
        userId: login.id,
        username: login.username,
      };
    } else throw new UnauthorizedException();
  }

  async kakaoValidateUser({
    profile,
    kakaoAccessToken,
    kakaoRefreshToken,
  }: any): Promise<any> {
    // 카카오 프로필 정보를 통해 유저 검증 및 DB에 저장하거나 불러옵니다.

    const existingUser = await this.authRepository.findOne({
      where: { id: profile.id },
    });

    if (existingUser) {
      const payload = { sub: profile.id, username: profile.username };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      const jwtRefreshToken = await this.jwtService.signAsync(payload);

      existingUser.accessToken = jwtAccessToken;
      existingUser.refreshToken = jwtRefreshToken;

      await this.authRepository.save(existingUser);
      return existingUser;
    } else {
      // TypeORM으로 DB에 유저 추가
      const payload = { sub: profile.id, username: profile.username };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      const jwtRefreshToken = await this.jwtService.signAsync(payload);

      const newUser = await this.authRepository
        .createQueryBuilder()
        .insert()
        .values({
          id: profile.id,
          username: profile.username,
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
          kakaoAccessToken: kakaoAccessToken,
          kakaoRefreshToken: kakaoRefreshToken,
          isEmailConfirmed: true,
        })
        .execute();
      console.log(newUser);
      return newUser;
    }
  }

  async googleValidateUser({
    profile,
    googleAccessToken,
    googleRefreshToken,
  }: any): Promise<any> {
    // 구글 프로필 정보를 통해 유저 검증 및 DB에 저장하거나 불러옵니다.
    console.log('google Login Profile', profile);
    const existingUser = await this.authRepository.findOne({
      where: { id: profile.id },
    });

    if (existingUser) {
      const payload = { sub: profile.id, username: profile.username };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      const jwtRefreshToken = await this.jwtService.signAsync(payload);

      existingUser.accessToken = jwtAccessToken;
      existingUser.refreshToken = jwtRefreshToken;

      await this.authRepository.save(existingUser);
      return existingUser;
    } else {
      // TypeORM으로 DB에 유저 추가
      const payload = { sub: profile.id, username: profile.username };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      const jwtRefreshToken = await this.jwtService.signAsync(payload);

      const newUser = await this.authRepository
        .createQueryBuilder()
        .insert()
        .values({
          id: profile.id,
          username: profile.displayName,
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
          googleAccessToken: googleAccessToken,
          googleRefreshToken: googleRefreshToken,
          isEmailConfirmed: true,
        })
        .execute();
      console.log(newUser);
      return newUser;
    }
  }

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: string,
  ): Promise<string> {
    const payload = { thirdPartyId, provider };
    return this.jwtService.signAsync(payload);
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken); // 리프레시 토큰 검증
      console.log('토큰 검사 완료', decoded);

      const user = await this.authRepository.findOne(decoded.id);
      if (!user) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id, username: user.username };
      return {
        accessToken: this.jwtService.sign(payload), // 새 액세스 토큰 발급
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getUsernames(userIds: string[]): Promise<any> {
    // userIds의 순서 유지해서 반환
    const users = await this.authRepository
      .createQueryBuilder('auth')
      .select(['auth.id as id', 'auth.username as username']) // alias 지정
      .where('auth.id IN (:...userIds)', { userIds }) // 문자열 배열 처리
      .getRawMany();

      // userIds 순서에 맞게 결과 재정렬
    const userMap = new Map(users.map(user => [user.id, user]));
    return userIds.map(id => userMap.get(id) || { id, username: 'Unknown' });
  }
}
