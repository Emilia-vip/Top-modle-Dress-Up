import { useState, useEffect, useContext } from "react";
import apiClient from "../api/client";
import { AuthContext } from "../contexts/AuthContext";
import { useLoading } from "./useLoading";
export const useRating = () => {
    const { user } = useContext(AuthContext);
    const { loading, setLoading } = useLoading(true);
    const [outfits, setOutfits] = useState([]);
    const [ratedOutfits, setRatedOutfits] = useState(new Set());
    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const res = await apiClient.get("/outfits");
                // Filtrera bort användarens egna outfits
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
    return { outfits, ratedOutfits, loading, handleRate, user };
};
