import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { findClothingItem } from "../utils/clothingUtils";
export const OutfitCard = ({ outfit, onRate, isRated }) => {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);
    const top = findClothingItem(outfit.top_id, "top");
    const bottom = findClothingItem(outfit.bottom_id, "bottom");
    return (_jsxs("div", { className: "mt-10 md:mt-20 h-48 md:h-72 bg-white/80 rounded-xl md:rounded-2xl p-4 flex flex-col items-center shadow-lg", children: [_jsxs("p", { className: "font-bold text-xs md:text-base text-purple-900 mb-2", children: ["@", outfit.username] }), _jsxs("div", { className: "relative w-24 md:w-40 h-28 md:h-56", children: [bottom && _jsx("img", { src: bottom.image, className: "absolute inset-0 w-full h-full object-contain", alt: "Bottom" }), top && _jsx("img", { src: top.image, className: "absolute inset-0 w-full h-full object-contain", alt: "Top" })] }), _jsx("div", { className: "flex gap-1 mt-3", children: [1, 2, 3, 4, 5].map((star) => (_jsx("span", { className: `cursor-pointer text-xl md:text-3xl transition-colors ${star <= (hovered || selected) ? "text-yellow-400" : "text-gray-400"}`, onMouseEnter: () => setHovered(star), onMouseLeave: () => setHovered(0), onClick: () => {
                        setSelected(star);
                        onRate(outfit._id, star);
                    }, children: "\u2605" }, star))) }), isRated && _jsx("p", { className: "text-green-600 text-[10px] md:text-sm mt-1 font-semibold", children: "Sent!" })] }));
};
