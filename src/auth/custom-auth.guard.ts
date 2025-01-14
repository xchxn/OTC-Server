// auth/custom-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class CustomAuthGuard extends AuthGuard(['jwt', 'kakao', 'google']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context, status) {
    const strategy = context.switchToHttp().getRequest().params.strategy;
    if (err || !user) {
      console.log(`Error in ${strategy} authentication.`, info);
      throw (
        err ||
        new UnauthorizedException(`Authentication failed using ${strategy}`)
      );
    }
    return user;
  }
}
