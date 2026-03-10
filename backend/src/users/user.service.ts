import bcrypt from 'bcrypt';
import { UserDatabaseModel } from '../types';
import * as repository from '../repository';

const BCRYPT_SALT_ROUNDS = 10;

export const findUserById = async (userId: string) => {
  return repository.findUserById(userId);
};

export const findUserByUsername = async (username: string) => {
  return repository.findUserByUsername(username);
};

export const findUserByAuth0Id = async (auth0Id: string) => {
  return repository.findUserByAuth0Id(auth0Id);
};

export const getAllUsers = async () => {
  return repository.getAllUsers();
};

export const insertUser = async (user: UserDatabaseModel) => {
  return repository.insertUser(user);
};

export const createUserFromAuth0 = async (
  auth0Id: string,
  username: string,
  password: string,
  email?: string
) => {
  return repository.createUserFromAuth0(auth0Id, username, password, email);
};

export const updateUserById = async (userId: string, updateData: Record<string, unknown>) => {
  return repository.updateUserById(userId, updateData);
};

export const deleteUserById = async (userId: string) => {
  return repository.deleteUserById(userId);
};

export const storeRefreshToken = async (userId: string, refreshToken: string, expiresAt: string) => {
  const tokenHash = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS);
  await repository.updateUserById(userId, {
    refresh_token_hash: tokenHash,
    refresh_token_expires_at: expiresAt,
  });
};

export const verifyStoredRefreshToken = async (
  user: UserDatabaseModel,
  refreshToken: string
): Promise<boolean> => {
  if (!user.refresh_token_hash) {
    return false;
  }

  if (user.refresh_token_expires_at) {
    const expiresAt = new Date(user.refresh_token_expires_at).getTime();
    if (Number.isFinite(expiresAt) && Date.now() > expiresAt) {
      return false;
    }
  }

  return bcrypt.compare(refreshToken, user.refresh_token_hash);
};
