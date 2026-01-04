import { tops, bottoms } from "../data/clothes";

export const findClothingItem = (identifier: string, type: "top" | "bottom") => {
  const dark = type === "top" ? tops.dark : bottoms.dark;
  const light = type === "top" ? tops.light : bottoms.light;

  const foundById = dark.find(i => i.id === identifier) || light.find(i => i.id === identifier);
  if (foundById) return foundById;

  return (
    dark.find(i => i.name.toLowerCase() === identifier.toLowerCase()) ||
    light.find(i => i.name.toLowerCase() === identifier.toLowerCase()) ||
    null
  );
};