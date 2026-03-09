import { tops, bottoms } from "../data/clothes";

export const findClothingItem = (
  identifier: string,
  type: "top" | "bottom",
  preferredSkin?: "dark" | "light"
) => {
  const dark = type === "top" ? tops.dark : bottoms.dark;
  const light = type === "top" ? tops.light : bottoms.light;

  if (preferredSkin) {
    const primary = preferredSkin === "dark" ? dark : light;
    const secondary = preferredSkin === "dark" ? light : dark;

    return (
      primary.find((i) => i.id === identifier) ||
      primary.find((i) => i.name.toLowerCase() === identifier.toLowerCase()) ||
      secondary.find((i) => i.id === identifier) ||
      secondary.find((i) => i.name.toLowerCase() === identifier.toLowerCase()) ||
      null
    );
  }

  const foundById = dark.find((i) => i.id === identifier) || light.find((i) => i.id === identifier);
  if (foundById) return foundById;

  return (
    dark.find((i) => i.name.toLowerCase() === identifier.toLowerCase()) ||
    light.find((i) => i.name.toLowerCase() === identifier.toLowerCase()) ||
    null
  );
};