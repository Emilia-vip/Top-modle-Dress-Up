import MongoConnection from './db';
import { UserDatabaseModel } from './types';

// --- Users ---

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
  const doc: any = {
    auth0_id: auth0Id,
    username,
    password,
    role: 'user',
    phone: '',
    created_at: new Date().toISOString(),
  };
  if (email) doc.email = email;

  return await col.insertOne(doc);
};

export const linkAuth0ToUsername = async (
  username: string,
  auth0Id: string,
  email?: string
) => {
  const col = await MongoConnection.userCollection();
  const updateData: Record<string, unknown> = { auth0_id: auth0Id };
  if (email) updateData.email = email;

  return await col.updateOne({ username }, { $set: updateData });
};

export const getAllUsers = async () => {
  const col = await MongoConnection.userCollection();
  return await col.find({}).toArray();
};

export const updateUserById = async (id: string, updateData: any) => {
  const col = await MongoConnection.userCollection();
  return await col.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  );
};
