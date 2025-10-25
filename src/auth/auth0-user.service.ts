import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TokenResponse from './interface/token-response.interface';
import Auth0User from './interface/auth0-user.interface';

@Injectable()
export class Auth0UserService {
  private managementToken: string | null = null;
  private tokenExpiresAt = 0;

  private readonly domain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly managementAudience: string;

  constructor(private readonly configService: ConfigService) {
    this.domain = this.configService.get<string>('auth0.domain')!;
    this.clientId = this.configService.get<string>('auth0.client_id')!;
    this.clientSecret = this.configService.get<string>('auth0.client_secret')!;
    this.managementAudience = this.configService.get<string>(
      'auth0.management_api_audience',
    )!;

    if (
      !this.domain ||
      !this.clientId ||
      !this.clientSecret ||
      !this.managementAudience
    ) {
      throw new Error(
        'Auth0 config (domain/clientId/clientSecret/audience) is required',
      );
    }
  }

  private async getManagementToken(): Promise<string> {
    const now = Date.now();
    if (this.managementToken && now < this.tokenExpiresAt - 5000) {
      return this.managementToken;
    }

    try {
      const res = await fetch(`https://${this.domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: this.managementAudience,
          grant_type: 'client_credentials',
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to get Auth0 token:', text);
        throw new HttpException(
          'Failed to obtain Auth0 management token',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = (await res.json()) as TokenResponse;
      this.managementToken = data.access_token;
      this.tokenExpiresAt = now + data.expires_in * 1000;
      return this.managementToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to get Auth0 token:', error.message);
      } else {
        console.error('Unknown error while getting Auth0 token:', error);
      }

      throw new HttpException(
        'Failed to obtain Auth0 management token',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getUserProfile(auth0UserId: string): Promise<Auth0User> {
    try {
      const token = await this.getManagementToken();
      const encodedId = encodeURIComponent(auth0UserId);
      const fields = 'user_id,name,picture,email';
      const url = `https://${this.domain}/api/v2/users/${encodedId}?fields=${encodeURIComponent(fields)}&include_fields=true`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const text = await res.text();
        console.error('Failed to fetch user profile:', text);
        throw new HttpException(
          'Failed to fetch user profile',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = (await res.json()) as Auth0User;
      return data;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Error) {
        console.error('Auth0 getUserProfile error:', error.message);
      } else {
        console.error('Unknown error while fetching user profile:', error);
      }

      throw new HttpException(
        'Failed to fetch user profile',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
