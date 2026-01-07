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

export type Rating = {
  grade: number;
  username: string;
};

export type OutfitDatabaseModel = {
  _id: string;
  username: string;
  top_id: string;
  bottom_id: string;
  skin?: "dark" | "light";
  ratings: Rating[];
  created_at: string;
};

export type { UserDatabaseModel };
