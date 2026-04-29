export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthenticationTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
