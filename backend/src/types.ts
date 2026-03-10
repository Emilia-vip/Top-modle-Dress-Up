type UserDatabaseModel = {
  _id: string;
  username: string;
  role: 'user' | 'admin';
  email: string;
  phone: string;
  password: string;
  refresh_token_hash?: string;
  refresh_token_expires_at?: string;
  created_at: string;
};

export interface TokenPayload {
  user_id: string;
  role: string;
  type: string;
}

export type { UserDatabaseModel };
