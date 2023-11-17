import { TokenInfoDto } from 'src/user/dto/token/token-info.dto';

/**
 * User information retrieved from the JWT token
 */
export type UserRequestData = TokenInfoDto & { iat: number; exp: string };