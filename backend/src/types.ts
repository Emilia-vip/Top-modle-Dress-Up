type UserDatabaseModel = {
  _id: string;
  username: string;
  role: 'user' | 'admin';
  email: string;
  phone: string;
  password: string;
  created_at: string;
};

export interface TokenPayload {
  user_id: string;
  role: string;
  type: string;
}

export type { UserDatabaseModel };
