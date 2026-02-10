import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { findClothingItem } from "../utils/clothingUtils"; // Använd util-filen vi skapade för ProfilePage!
export const PodiumPlace = ({ user, rank, sizeClasses }) => {
    const bottom = user.outfit ? findClothingItem(user.outfit.bottom_id, "bottom") : null;
    const top = user.outfit ? findClothingItem(user.outfit.top_id, "top") : null;
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: `${sizeClasses.container} bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-md overflow-hidden relative`, children: [bottom && _jsx("img", { src: bottom.image, className: "absolute inset-0 w-full h-full object-contain", alt: "Bottom" }), top && _jsx("img", { src: top.image, className: "absolute inset-0 w-full h-full object-contain", alt: "Top" })] }), _jsx("span", { className: `mt-1 md:mt-3 font-bold text-gray-900 ${sizeClasses.text}`, children: user.username }), _jsx("span", { className: `text-yellow-400 font-extrabold ${sizeClasses.text}`, children: user.averageRating.toFixed(1) }), _jsx("span", { className: `mt-0.5 md:mt-1 font-semibold text-gray-800 ${sizeClasses.rankText}`, children: rank })] }));
};
