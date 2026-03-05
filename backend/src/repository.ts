import MongoConnection from './db';
import { OutfitDatabaseModel, Rating, UserDatabaseModel } from './types';

export const insertUser = async (user: UserDatabaseModel) => {
  return await MongoConnection.userCollection().insertOne(user);
};

export const findUserByUsername = async (username: string) => {
  return await MongoConnection.userCollection().findOne({ username: username });
};

export const findUserById = async (id: string) => {
  return await MongoConnection.userCollection().findOne({ _id: id });
};


export const findUserByAuth0Id = async (auth0Id: string) => {
  return await MongoConnection.userCollection().findOne({ auth0_id: auth0Id });
};


export const createUserFromAuth0 = async (
  auth0Id: string,
  username: string,
  email?: string
) => {
  const doc: any = { auth0_id: auth0Id, username };
  if (email) doc.email = email;
  doc.created_at = new Date();
  return await MongoConnection.userCollection().insertOne(doc);
};


export const getAllUsers = async () => {
  return await MongoConnection.userCollection().find({}).toArray();
};



export const insertOutfit = async (outfit: OutfitDatabaseModel) => {
  return await MongoConnection.outfitsCollection().insertOne(outfit);
};


export const getAllOutfits = async () => {
  return await MongoConnection.outfitsCollection().find({}).toArray();
};

export const getOutfitsByUserId = async (userId: string) => {

  return await MongoConnection.outfitsCollection()
    .find({ username: userId })
    .toArray();
};

export const getLatestOutfitByUserId = async (userId: string) => {
  return await MongoConnection.outfitsCollection()
    .find({ username: userId })
    .sort({ created_at: -1 })
    .limit(1)
    .toArray();
};

export const deleteOutfitsByUsername = async (username: string) => {
  return await MongoConnection.outfitsCollection().deleteMany({ username });
};

export const deleteOutfitById = async (id: string) => {
  return await MongoConnection.outfitsCollection().deleteOne({ _id: id });
};

export const findOutfitById = async (id: string) => {
  return await MongoConnection.outfitsCollection().findOne({ _id: id });
};

export const updateOutfit = async (
  id: string,
  updates: {
    top_id?: string;
    bottom_id?: string;
  }
) => {
  return await MongoConnection.outfitsCollection().updateOne(
    { _id: id },
    { $set: updates }
  );
};

export const rateOutfit = async (id: string, rating: Rating) => {
  return await MongoConnection.outfitsCollection().updateOne(
    { _id: id },
    { $push: { ratings: rating } }
  );
};

export const updateUserById = async (id: string, updateData: any) => {
  return await MongoConnection.userCollection().findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  );
};
