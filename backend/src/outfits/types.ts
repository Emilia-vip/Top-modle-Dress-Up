

export type OutfitDatabaseModel = {
  _id: string;
  username: string;
  top_id: string;
  bottom_id: string;
  skin?: "dark" | "light";
  created_at: string;
};


export type CreateOutfitDto = {
  username: string;
  top_id: string;
  bottom_id: string;
  skin?: "dark" | "light";

};