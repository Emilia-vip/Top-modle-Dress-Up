import { useState, useEffect } from "react";
import apiClient from "../api/client";
import type { Outfit, UserScore } from "../type";

type RatingRecord = {
  _id: string;
  outfitId: string;
  grade: number;
  username: string;
  created_at: string;
};

export const useScores = () => {
  const [topUsers, setTopUsers] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const [outfitsResponse, ratingsResponse] = await Promise.all([
          apiClient.get<Outfit[]>("/outfits"),
          apiClient.get<RatingRecord[]>("/ratings"),
        ]);

        const outfits = outfitsResponse.data;
        const ratings = ratingsResponse.data;

        const outfitOwnerById: Record<string, string> = {};
        const outfitsByUser: Record<string, Outfit[]> = {};

        outfits.forEach((outfit) => {
          outfitOwnerById[outfit._id] = outfit.username;
          if (!outfitsByUser[outfit.username]) {
            outfitsByUser[outfit.username] = [];
          }
          outfitsByUser[outfit.username].push(outfit);
        });

        const userRatings: Record<string, number[]> = {};

        // Include users with outfits even if they have no ratings yet.
        Object.keys(outfitsByUser).forEach((username) => {
          userRatings[username] = [];
        });

        ratings.forEach((rating) => {
          const owner = outfitOwnerById[rating.outfitId];
          if (!owner) {
            return;
          }

          if (!userRatings[owner]) {
            userRatings[owner] = [];
          }
          userRatings[owner].push(rating.grade);
        });

        const userScores: UserScore[] = Object.entries(userRatings).map(([username, grades]) => ({
          username,
          averageRating:
            grades.length > 0 ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : 0,
          totalRatings: grades.length,
        }));

        const sortedUsers = userScores
          .sort((a, b) => {
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            return b.totalRatings - a.totalRatings;
          })
          .slice(0, 3);

        const ratingsByOutfit: Record<string, number[]> = {};
        ratings.forEach((rating) => {
          if (!ratingsByOutfit[rating.outfitId]) {
            ratingsByOutfit[rating.outfitId] = [];
          }
          ratingsByOutfit[rating.outfitId].push(rating.grade);
        });

        const usersWithOutfits = sortedUsers.map((user) => {
          const userOutfits = outfitsByUser[user.username] ?? [];

          const bestOutfit = userOutfits.reduce<Outfit | undefined>((best, current) => {
            if (!best) {
              return current;
            }

            const currentRatings = ratingsByOutfit[current._id] ?? [];
            const bestRatings = ratingsByOutfit[best._id] ?? [];

            const currentAvg =
              currentRatings.length > 0
                ? currentRatings.reduce((sum, grade) => sum + grade, 0) / currentRatings.length
                : 0;
            const bestAvg =
              bestRatings.length > 0
                ? bestRatings.reduce((sum, grade) => sum + grade, 0) / bestRatings.length
                : 0;

            if (currentAvg !== bestAvg) {
              return currentAvg > bestAvg ? current : best;
            }

            return currentRatings.length > bestRatings.length ? current : best;
          }, undefined);

          return { ...user, outfit: bestOutfit };
        });

        setTopUsers(usersWithOutfits);
      } catch (error) {
        console.error("Score fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return { topUsers, loading };
};