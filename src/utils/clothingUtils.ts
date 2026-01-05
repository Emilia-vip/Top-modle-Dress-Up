import { tops, bottoms } from "../data/clothes";

export const findClothingItem = (
  identifier: string, 
  type: "top" | "bottom",
  skin: "dark" | "light" = "light" // Standard till light om inget anges
) => {
  // 1. Välj rätt kollektion baserat på skin direkt
  const collection = type === "top" ? tops[skin] : bottoms[skin];

  // 2. Leta i den valda kollektionen (både på ID och namn)
  const found = collection.find(
    (i) => i.id === identifier || i.name.toLowerCase() === identifier.toLowerCase()
  );

  if (found) return found;

  // 3. Fallback: Om det mot förmodan inte fanns i rätt skin, kolla det andra
  const fallbackSkin = skin === "light" ? "dark" : "light";
  const fallbackCollection = type === "top" ? tops[fallbackSkin] : bottoms[fallbackSkin];
  
  return fallbackCollection.find(
    (i) => i.id === identifier || i.name.toLowerCase() === identifier.toLowerCase()
  ) || null;
};