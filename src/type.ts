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
