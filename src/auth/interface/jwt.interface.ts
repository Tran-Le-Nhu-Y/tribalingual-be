import { JWTPayload } from 'jose';

export type JWTGrantType = 'authorization-code' | 'refresh-token' | 'password';

export default interface AuthzPayload extends JWTPayload {
  /**
   * Grant type
   */
  gty: JWTGrantType;
  /**
   * Authorized Party
   */
  azp: string;
  /**
   * Permissions (Scopes)
   */
  permissions: string[];
}
