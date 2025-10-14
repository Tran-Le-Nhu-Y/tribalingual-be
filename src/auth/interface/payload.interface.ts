export type JWTGrantType =
  | 'authorization-code'
  | 'client-credentials'
  | 'refresh-token'
  | 'password';

export default interface JWTPayload {
  /**
   * Issuer
   */
  iss: string;
  /**
   * Subject
   */
  sub: string;
  /**
   * Audience
   */
  aud: string;
  /**
   * Issue at (milliseconds)
   */
  iat: number;
  /**
   * Expired time (milliseconds)
   */
  exp: number;
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
