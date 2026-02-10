import { useState, useEffect } from "react";
import apiClient from "../api/client";
export const useScores = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await apiClient.get("/outfits");
                const outfits = response.data;
                // Beräkna betyg 
                const userRatings = {};
                outfits.forEach((outfit) => {
                    if (!userRatings[outfit.username])
                        userRatings[outfit.username] = [];
                    userRatings[outfit.username].push(...outfit.ratings.map(r => r.grade));
                });
                const userScores = Object.entries(userRatings).map(([username, ratings]) => ({
                    username,
                    averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
                    totalRatings: ratings.length,
                }));
                // Sortera och ta topp 3
                const sortedUsers = userScores.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
                // Hitta bästa outfit för varje topp-användare
                const usersWithOutfits = sortedUsers.map(user => {
                    const userOutfits = outfits.filter(o => o.username === user.username);
                    const bestOutfit = userOutfits.reduce((best, curr) => (curr.ratings.length > best.ratings.length) ? curr : best, userOutfits[0]);
                    return { ...user, outfit: bestOutfit };
                });
                setTopUsers(usersWithOutfits);
            }
            catch (error) {
                console.error("Score fetch failed", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);
    return { topUsers, loading };
};
