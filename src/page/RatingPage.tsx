import { useState, useEffect, useContext } from "react";
import runway from "../assets/runway-bla.png";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { AuthContext } from "../contexts/AuthContext";
import { tops, bottoms } from "../data/clothes";

function RatingPage() {
  const { user } = useContext(AuthContext);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const [ratedOutfits, setRatedOutfits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await apiClient.get<Outfit[]>("/outfits");

        // ❗ Remove your own outfit
        const filtered = res.data.filter(
          (o) => o.username !== user?.username
        );

        setOutfits(filtered);
      } catch (error) {
        console.error("Failed to fetch outfits", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [user?.username]);

  const findClothingItem = (name: string, type: "top" | "bottom") => {
    const dark = type === "top" ? tops.dark : bottoms.dark;
    const light = type === "top" ? tops.light : bottoms.light;
    return (
      dark.find((i) => i.name === name) ||
      light.find((i) => i.name === name) ||
      null
    );
  };

  const handleRate = async (outfitId: string, rating: number) => {
    if (!user?.username) {
      return;
    }

    try {
      await apiClient.post(`/outfits/${outfitId}/rate`, {
        grade: rating,
        username: user.username
      });
      setRatedOutfits(prev => new Set(prev).add(outfitId));
    } catch (error) {
      console.error("Failed to rate outfit", error);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading outfits...</div>;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center p-10"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outfits.map((outfit) => {
          const top = findClothingItem(outfit.top_id, "top");
          const bottom = findClothingItem(outfit.bottom_id, "bottom");

          return (
            <div
              key={outfit._id}
              className="mt-40 h-60 bg-white/80 rounded-2xl p-4 flex flex-col items-center height"
            >
              <p className="font-bold text-purple-900 mb-2">
                @{outfit.username}
              </p>

              <div className="relative w-40 h-56">
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

              {/* ⭐ STAR RATING */}
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-3xl ${
                      star <= (hovered || selected)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => {
                      setSelected(star);
                      handleRate(outfit._id, star);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              {/* Send message */}
              {ratedOutfits.has(outfit._id) && (
                <div className="text-green-600 font-semibold text-sm mt-2">
                  Send!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingPage;
