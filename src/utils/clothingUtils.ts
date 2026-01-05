import { tops, bottoms } from "../data/clothes";

export const findClothingItem = (
  identifier: string, 
  type: "top" | "bottom",
  skin: "dark" | "light" = "light" 
) => {
  // 1. Välj rätt kollektion baserat på hud
  const collection = type === "top" ? tops[skin] : bottoms[skin];

  // 2. Leta i den valda kollektionen (både på ID och namn)
  const found = collection.find(
    (i) => i.id === identifier || i.name.toLowerCase() === identifier.toLowerCase()
  );

  if (found) return found;

  // 3. Fallback: Om det inte fanns i rätt skin, kolla det andra
  const fallbackSkin = skin === "light" ? "dark" : "light";
  const fallbackCollection = type === "top" ? tops[fallbackSkin] : bottoms[fallbackSkin];
  
  return fallbackCollection.find(
    (i) => i.id === identifier || i.name.toLowerCase() === identifier.toLowerCase()
  ) || null;
};