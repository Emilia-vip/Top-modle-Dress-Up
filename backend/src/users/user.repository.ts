import MongoConnection from '../database/db';
import { UserDatabaseModel } from './types';

export const insertUser = async (user: UserDatabaseModel) => {
  const col = await MongoConnection.userCollection();
  return await col.insertOne(user);
};

export const findUserByUsername = async (username: string) => {
  const col = await MongoConnection.userCollection();
  return await col.findOne({ username });
};

export const findUserById = async (id: string) => {
  const col = await MongoConnection.userCollection();
  return await col.findOne({ _id: id });
};

export const findUserByAuth0Id = async (auth0Id: string) => {
  const col = await MongoConnection.userCollection();
  return await col.findOne({ auth0_id: auth0Id });
};

export const createUserFromAuth0 = async (
  auth0Id: string,
  username: string,
  password: string,
  email?: string
) => {
  const col = await MongoConnection.userCollection();
  const doc: Record<string, unknown> = {
    auth0_id: auth0Id,
    username,
    password,
    role: 'user',
    phone: '',
    created_at: new Date().toISOString(),
  };

  if (email) {
    doc.email = email;
  }

  return await col.insertOne(doc);
};

export const getAllUsers = async () => {
  const col = await MongoConnection.userCollection();
  return await col.find({}).toArray();
};

export const updateUserById = async (id: string, updateData: Record<string, unknown>) => {
  const col = await MongoConnection.userCollection();
  return await col.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  );
};

export const deleteUserById = async (id: string) => {
  const col = await MongoConnection.userCollection();
  const res = await col.deleteOne({ _id: id });
  return res.deletedCount ?? 0;
};
