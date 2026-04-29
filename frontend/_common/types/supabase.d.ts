export {};

declare global {
  namespace Entity {
    interface SupabaseSession {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
      userId: string;
    }

    interface SupabaseError {
      message: string;
      statusCode: number;
    }
  }
}
