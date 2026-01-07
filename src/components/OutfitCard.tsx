import React, { useState } from "react";
import type { Outfit } from "../type";
import { findClothingItem } from "../utils/clothingUtils";

interface OutfitCardProps {
  outfit: Outfit;
  onRate: (id: string, rating: number) => void;
  isRated: boolean;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onRate, isRated }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const top = findClothingItem(outfit.top_id, "top");
  const bottom = findClothingItem(outfit.bottom_id, "bottom");

  return (
    <div className="mt-10 md:mt-20 h-48 md:h-72 bg-white/80 rounded-xl md:rounded-2xl p-4 flex flex-col items-center shadow-lg">
      <p className="font-bold text-xs md:text-base text-purple-900 mb-2">@{outfit.username}</p>

      <div className="relative w-24 md:w-40 h-28 md:h-56">
        {bottom && <img src={bottom.image} className="absolute inset-0 w-full h-full object-contain" alt="Bottom" />}
        {top && <img src={top.image} className="absolute inset-0 w-full h-full object-contain" alt="Top" />}
      </div>

      <div className="flex gap-1 mt-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-xl md:text-3xl transition-colors ${
              star <= (hovered || selected) ? "text-yellow-400" : "text-gray-400"
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => {
              setSelected(star);
              onRate(outfit._id, star);
            }}
          >
            
          </span>
        ))}
      </div>
      {isRated && <p className="text-green-600 text-[10px] md:text-sm mt-1 font-semibold">Sent!</p>}
    </div>
  );
};