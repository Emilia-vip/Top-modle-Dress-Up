import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { useLoading } from "./useLoading";
import { useActiveAuth } from "./useActiveAuth";

export const useProfile = () => {
  const { user, hasLegacySession } = useActiveAuth();
  const { loading, setLoading } = useLoading(true);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!hasLegacySession) {
      setProfileData({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get("/user/me");
      setProfileData({
        username: res.data.username || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
    } catch (err) {
      console.error("Kunde inte hämta användardata", err);
    } finally {
      setLoading(false);
    }
  }, [hasLegacySession, setLoading, user?.email, user?.phone, user?.username]);

  const fetchOutfits = useCallback(async () => {
    if (!user?.username) {
      setOutfitsLoading(false);
      return;
    }
    try {
      const res = await apiClient.get<Outfit[]>(`/outfits/user/${user.username}`);
      setOutfits(res.data);
    } catch (err) {
      console.error("Kunde inte hämta outfits", err);
    } finally {
      setOutfitsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchUser();
    fetchOutfits();
  }, [fetchUser, fetchOutfits]);

  // Uppdatera vid fokus (när användaren kommer tillbaka till fliken)
  useEffect(() => {
    const onFocus = () => fetchOutfits();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchOutfits]);

  const handleSave = async () => {
    if (!hasLegacySession) {
      setMessage("Profile updates for Auth0 accounts are not supported in this form yet.");
      return;
    }

    try {
      const updateData: any = { 
        user, 
        email: profileData.email.trim(),
        phone: profileData.phone.trim()
      };
      if (password.trim()) updateData.password = password.trim();

      await apiClient.post("/user/update", updateData);
      setMessage("Profile updated!");
      setPassword("");
    } catch (err) {
      setMessage("Oops! Profile update failed");
    }
  };

  return {
    profileData,
    setProfileData,
    password,
    setPassword,
    message,
    outfits,
    outfitsLoading,
    loading,
    handleSave,
  };
};