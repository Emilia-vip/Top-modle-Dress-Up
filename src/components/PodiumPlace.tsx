import React from "react";
import type { UserScore } from "../type";
import { findClothingItem } from "../utils/clothingUtils"; // Använd util-filen vi skapade för ProfilePage!

interface PodiumProps {
  user: UserScore;
  rank: "1st" | "2nd" | "3rd";
  sizeClasses: {
    container: string;
    text: string;
    rankText: string;
  };
}

export const PodiumPlace: React.FC<PodiumProps> = ({ user, rank, sizeClasses }) => {
  const bottom = user.outfit ? findClothingItem(user.outfit.bottom_id, "bottom") : null;
  const top = user.outfit ? findClothingItem(user.outfit.top_id, "top") : null;

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses.container} bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-md overflow-hidden relative`}>
        {bottom && <img src={bottom.image} className="absolute inset-0 w-full h-full object-contain" alt="Bottom" />}
        {top && <img src={top.image} className="absolute inset-0 w-full h-full object-contain" alt="Top" />}
      </div>
      <span className={`mt-1 md:mt-3 font-bold text-gray-900 ${sizeClasses.text}`}>{user.username}</span>
      <span className={`text-yellow-400 font-extrabold ${sizeClasses.text}`}>
        {user.averageRating.toFixed(1)}
      </span>
      <span className={`mt-0.5 md:mt-1 font-semibold text-gray-800 ${sizeClasses.rankText}`}>{rank}</span>
    </div>
  );
};