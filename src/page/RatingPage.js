import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext } from "react";
import runway from "../assets/runway,new.png";
import apiClient from "../api/client";
import { AuthContext } from "../contexts/AuthContext";
import { tops, bottoms } from "../data/clothes";
import { useLoading } from "../hooks/useLoading";
import LoadingSpinner from "../components/LoadingSpinner";
function RatingPage() {
    const { user } = useContext(AuthContext);
    const { loading, setLoading } = useLoading(true);
    const [outfits, setOutfits] = useState([]);
    const [hovered, setHovered] = useState({});
    const [selected, setSelected] = useState({});
    const [ratedOutfits, setRatedOutfits] = useState(new Set());
    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const res = await apiClient.get("/outfits");
                const filtered = res.data.filter((o) => o.username !== user?.username);
                setOutfits(filtered);
            }
            catch (error) {
                console.error("Failed to fetch outfits", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchOutfits();
    }, [user?.username, setLoading]);
    const findClothingItem = (name, type) => {
        const dark = type === "top" ? tops.dark : bottoms.dark;
        const light = type === "top" ? tops.light : bottoms.light;
        return (dark.find((i) => i.name === name) ||
            light.find((i) => i.name === name) ||
            null);
    };
    const handleRate = async (outfitId, rating) => {
        if (!user?.username)
            return;
        try {
            await apiClient.post(`/outfits/${outfitId}/rate`, {
                grade: rating,
                username: user.username,
            });
            setRatedOutfits((prev) => new Set(prev).add(outfitId));
        }
        catch (error) {
            console.error("Failed to rate outfit", error);
        }
    };
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    return (_jsx("div", { className: "min-h-screen w-full bg-cover bg-center flex justify-center p-4 md:p-10", style: { backgroundImage: `url(${runway})` }, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", children: outfits.map((outfit) => {
                const top = findClothingItem(outfit.top_id, "top");
                const bottom = findClothingItem(outfit.bottom_id, "bottom");
                return (_jsxs("div", { className: "mt-20 md:mt-40 h-48 md:h-60 bg-white/80 rounded-2xl p-3 md:p-4 flex flex-col items-center", children: [_jsxs("p", { className: "font-bold text-sm md:text-base text-purple-900 mb-1 md:mb-2", children: ["@", outfit.username] }), _jsxs("div", { className: "relative w-32 md:w-40 h-40 md:h-56", children: [bottom && (_jsx("img", { src: bottom.image, className: "absolute inset-0 w-full h-full object-contain" })), top && (_jsx("img", { src: top.image, className: "absolute inset-0 w-full h-full object-contain" }))] }), _jsx("div", { className: "flex gap-1 mt-2 md:mt-3", children: [1, 2, 3, 4, 5].map((star) => (_jsx("span", { className: `cursor-pointer text-2xl md:text-3xl ${star <=
                                    (hovered[outfit._id] || selected[outfit._id] || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-400"}`, onMouseEnter: () => setHovered((p) => ({ ...p, [outfit._id]: star })), onMouseLeave: () => setHovered((p) => ({ ...p, [outfit._id]: 0 })), onClick: () => {
                                    setSelected((p) => ({ ...p, [outfit._id]: star }));
                                    handleRate(outfit._id, star);
                                }, children: "\u2605" }, star))) }), ratedOutfits.has(outfit._id) && (_jsx("p", { className: "text-green-600 text-xs md:text-sm mt-1 md:mt-2 font-semibold", children: "Sent!" }))] }, outfit._id));
            }) }) }));
}
export default RatingPage;
