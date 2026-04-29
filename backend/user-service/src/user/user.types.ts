export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface UpdateUserProfilePayload {
  displayName?: string;
}
