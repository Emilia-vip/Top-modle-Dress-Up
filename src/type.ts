export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};
export type User = {
  _id: string;
  username: string,
  email: string;
  password: string;
  name: string;
  role: string;
  phone: string;
  created_at: string;
};

export type Outfit = {
  _id: string;
  username: string;
  top_id: string;
  bottom_id: string;
  ratings: Rating[];
  created_at: string;
};

export type Rating = {
  grade: number;
  username: string;
};

export type ClothingItem = { 
  id?: string; 
  name: string; 
  image: string; 
};

export type ClothingCollection = { 
  dark: ClothingItem[]; 
  light: ClothingItem[]; 
};

export interface UserScore {
  username: string;
  averageRating: number;
  totalRatings: number;
  outfit?: Outfit;
}