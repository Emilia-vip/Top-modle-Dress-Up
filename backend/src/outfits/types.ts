
// För flexibilitet: _id kan vara string (du använder crypto.randomUUID) eller MongoDB ObjectId
export type OutfitDatabaseModel = {
  _id: string | import('mongodb').ObjectId;
  username: string;
  top_id: string;
  bottom_id: string;
  skin?: "dark" | "light";
  created_at: string; // ISO timestamp string
};

// DTO som används vid skapande från klienten
export type CreateOutfitDto = {
  username: string;
  top_id: string;
  bottom_id: string;
  skin?: "dark" | "light";
  // eventuella fler fält klienten skickar
};