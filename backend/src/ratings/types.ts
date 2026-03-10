export type CreateRatingDto = {
  grade: number;
  username: string;
};

export type RatingDatabaseModel = {
  _id: string | import('mongodb').ObjectId;
  outfitId: string;
  grade: number;
  username: string;
  created_at: string;
};