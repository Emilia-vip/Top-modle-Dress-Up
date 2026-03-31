import { ObjectId } from 'mongodb';


export type CreateRatingDto = {
  grade: number;
  username: string;
};

export type RatingDatabaseModel = {
  _id: string | ObjectId;
  outfitId: string;
  grade: number;
  username: string;
  created_at: string;
};