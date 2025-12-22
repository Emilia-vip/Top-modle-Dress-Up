import { useState, useEffect } from "react";
import runway from "../assets/runway-bla.png";
import apiClient from "../api/client";
import { tops, bottoms } from "../data/clothes";

interface Outfit {
  _id: string;
  username: string;
  top_id: string;
  bottom_id: string;
  ratings: { grade: number; username: string }[];
}

interface UserScore {
  username: string;
  averageRating: number;
  totalRatings: number;
  outfit?: Outfit;
}

function ScorePage() {
  const [topUsers, setTopUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to find clothing item by name
  const findClothingItem = (name: string, type: "top" | "bottom") => {
    const darkArray = type === "top" ? tops.dark : bottoms.dark;
    const lightArray = type === "top" ? tops.light : bottoms.light;
    
    const darkItem = darkArray.find(item => item.name.toLowerCase() === name.toLowerCase());
    const lightItem = lightArray.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    return darkItem || lightItem || null;
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await apiClient.get<Outfit[]>("/outfits");
        const outfits = response.data;

        // Group ratings by username and calculate averages
        const userRatings: { [username: string]: number[] } = {};

        outfits.forEach((outfit) => {
          if (!userRatings[outfit.username]) {
            userRatings[outfit.username] = [];
          }
          // Extract grade values from ratings array
          const grades = outfit.ratings.map(rating => rating.grade);
          userRatings[outfit.username].push(...grades);
        });

        // Calculate average ratings
        const userScores: UserScore[] = Object.entries(userRatings).map(([username, ratings]) => ({
          username,
          averageRating: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0,
          totalRatings: ratings.length,
        }));

        // Sort by average rating (highest first) and take top 3
        const sortedUsers = userScores
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 3);

        // Attach outfit data for each top user (find their highest rated outfit or latest)
        const usersWithOutfits = sortedUsers.map(user => {
          // Find all outfits for this user
          const userOutfits = outfits.filter(outfit => outfit.username === user.username);
          
          // Get the outfit with the most ratings, or the latest if tie
          const bestOutfit = userOutfits.reduce((best, current) => {
            if (current.ratings.length > best.ratings.length) {
              return current;
            } else if (current.ratings.length === best.ratings.length) {
              // If same number of ratings, pick the one with higher average rating
              const currentAvg = current.ratings.length > 0 
                ? current.ratings.reduce((sum, r) => sum + r.grade, 0) / current.ratings.length 
                : 0;
              const bestAvg = best.ratings.length > 0 
                ? best.ratings.reduce((sum, r) => sum + r.grade, 0) / best.ratings.length 
                : 0;
              return currentAvg > bestAvg ? current : best;
            }
            return best;
          }, userOutfits[0]);

          return {
            ...user,
            outfit: bestOutfit
          };
        });

        setTopUsers(usersWithOutfits);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${runway})` }}
      >
        <div className="text-white text-xl">Laddar poäng...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-end justify-center bg-cover bg-center px-10 py-10"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="flex items-end gap-16">
        {/* 2:a plats - vänster */}
        {topUsers[1] && (
          <div className="flex flex-col items-center">
            <div className="w-40 h-60 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden relative">
              {topUsers[1].outfit && (
                <>
                  {(() => {
                    const bottom = findClothingItem(topUsers[1].outfit!.bottom_id, "bottom");
                    const top = findClothingItem(topUsers[1].outfit!.top_id, "top");
                    return (
                      <>
                        {bottom && (
                          <img
                            src={bottom.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Bottom clothing"
                          />
                        )}
                        {top && (
                          <img
                            src={top.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Top clothing"
                          />
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
            <span className="mt-3 font-bold text-2xl text-gray-900">{topUsers[1].username}</span>
            <span className="text-yellow-400 font-extrabold text-2xl">
              {topUsers[1].averageRating.toFixed(1)}
            </span>
            <span className="mt-1 font-semibold text-gray-800 text-lg">2nd</span>
          </div>
        )}

        {/* 1:a plats - mitten */}
        {topUsers[0] && (
          <div className="flex flex-col items-center">
            <div className="w-48 h-80 bg-white rounded-xl flex items-center justify-center shadow-2xl overflow-hidden relative">
              {topUsers[0].outfit && (
                <>
                  {(() => {
                    const bottom = findClothingItem(topUsers[0].outfit!.bottom_id, "bottom");
                    const top = findClothingItem(topUsers[0].outfit!.top_id, "top");
                    return (
                      <>
                        {bottom && (
                          <img
                            src={bottom.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Bottom clothing"
                          />
                        )}
                        {top && (
                          <img
                            src={top.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Top clothing"
                          />
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
            <span className="mt-3 font-bold text-3xl text-gray-900">{topUsers[0].username}</span>
            <span className="text-yellow-400 font-extrabold text-3xl">
              {topUsers[0].averageRating.toFixed(1)}
            </span>
            <span className="mt-1 font-semibold text-gray-900 text-xl">1st</span>
          </div>
        )}

        {/* 3:e plats - höger */}
        {topUsers[2] && (
          <div className="flex flex-col items-center">
            <div className="w-36 h-52 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden relative">
              {topUsers[2].outfit && (
                <>
                  {(() => {
                    const bottom = findClothingItem(topUsers[2].outfit!.bottom_id, "bottom");
                    const top = findClothingItem(topUsers[2].outfit!.top_id, "top");
                    return (
                      <>
                        {bottom && (
                          <img
                            src={bottom.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Bottom clothing"
                          />
                        )}
                        {top && (
                          <img
                            src={top.image}
                            className="absolute inset-0 w-full h-full object-contain"
                            alt="Top clothing"
                          />
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
            <span className="mt-3 font-bold text-2xl text-gray-900">{topUsers[2].username}</span>
            <span className="text-yellow-400 font-extrabold text-2xl">
              {topUsers[2].averageRating.toFixed(1)}
            </span>
            <span className="mt-1 font-semibold text-gray-800 text-lg">3rd</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScorePage;
