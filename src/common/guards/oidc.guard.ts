import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PubSubConfig } from '../../config/pubsub';

@Injectable()
export class OidcGuard implements CanActivate {
  private readonly client = new OAuth2Client();

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException();

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) throw new UnauthorizedException();

    const { serviceAccountEmail, audience } = this.configService.get<PubSubConfig>('pubsub');

    try {
      const ticket = await this.client.verifyIdToken({ idToken: token, audience });
      const payload = ticket.getPayload();
      if (payload?.email !== serviceAccountEmail) throw new UnauthorizedException();
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
