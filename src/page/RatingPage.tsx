import { useState, useEffect, useContext } from "react";
import runway from "../assets/runway,new.png";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { AuthContext } from "../contexts/AuthContext";
import { tops, bottoms } from "../data/clothes";
import { useLoading } from "../hooks/useLoading";
import LoadingSpinner from "../components/LoadingSpinner";

function RatingPage() {
  const { user } = useContext(AuthContext);

  // ✅ Custom hook för loading
  const { loading, setLoading } = useLoading(true);

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [hovered, setHovered] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [ratedOutfits, setRatedOutfits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await apiClient.get<Outfit[]>("/outfits");

        // Ta bort ditt eget outfit
        const filtered = res.data.filter(
          (o) => o.username !== user?.username
        );

        setOutfits(filtered);
      } catch (error) {
        console.error("Failed to fetch outfits", error);
      } finally {
        setLoading(false); // ✅ från custom hook
      }
    };

    fetchOutfits();
  }, [user?.username, setLoading]);

  const findClothingItem = (identifier: string, type: "top" | "bottom") => {
    const dark = type === "top" ? tops.dark : bottoms.dark;
    const light = type === "top" ? tops.light : bottoms.light;

    // Först försök hitta via id (för nya sparade outfits)
    const foundById = 
      dark.find(i => i.id === identifier) ||
      light.find(i => i.id === identifier);
    
    if (foundById) return foundById;

    // Fallback till name (för bakåtkompatibilitet med gamla sparade outfits)
    return (
      dark.find((i) => i.name === identifier) ||
      light.find((i) => i.name === identifier) ||
      null
    );
  };

  const handleRate = async (outfitId: string, rating: number) => {
    if (!user?.username) return;

    try {
      await apiClient.post(`/outfits/${outfitId}/rate`, {
        grade: rating,
        username: user.username,
      });

      setRatedOutfits((prev) => new Set(prev).add(outfitId));
    } catch (error) {
      console.error("Failed to rate outfit", error);
    }
  };

  // ✅ Spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center p-2 md:p-10"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
        {outfits.map((outfit) => {
          const top = findClothingItem(outfit.top_id, "top");
          const bottom = findClothingItem(outfit.bottom_id, "bottom");

          return (
            <div
              key={outfit._id}
              className="mt-8 md:mt-40 h-36 md:h-60 bg-white/80 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col items-center"
            >
              <p className="font-bold text-xs md:text-base text-purple-900 mb-1 md:mb-2">
                @{outfit.username}
              </p>

              <div className="relative w-24 md:w-40 h-28 md:h-56">
                {bottom && (
                  <img
                    src={bottom.image}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                {top && (
                  <img
                    src={top.image}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
              </div>

              {/* ⭐ Rating */}
              <div className="flex gap-0.5 md:gap-1 mt-1 md:mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-lg md:text-3xl touch-manipulation ${
                      star <=
                      (hovered[outfit._id] || selected[outfit._id] || 0)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onMouseEnter={() =>
                      setHovered((p) => ({ ...p, [outfit._id]: star }))
                    }
                    onMouseLeave={() =>
                      setHovered((p) => ({ ...p, [outfit._id]: 0 }))
                    }
                    onClick={() => {
                      setSelected((p) => ({ ...p, [outfit._id]: star }));
                      handleRate(outfit._id, star);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {ratedOutfits.has(outfit._id) && (
                <p className="text-green-600 text-[10px] md:text-sm mt-0.5 md:mt-2 font-semibold">
                  Sent!
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingPage;
