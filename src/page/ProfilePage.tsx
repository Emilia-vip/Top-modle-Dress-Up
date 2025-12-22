import { useState, useEffect, useContext, useCallback } from "react";
import backstage from "../assets/backstage.png";
import { BASE_URL } from "../constants";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { tops, bottoms } from "../data/clothes";
import axios from "axios";



function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Outfits state
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);

  // Helper function to find clothing item by name
  const findClothingItem = (name: string, type: "top" | "bottom") => {
    const darkArray = type === "top" ? tops.dark : bottoms.dark;
    const lightArray = type === "top" ? tops.light : bottoms.light;

    return (
      darkArray.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      ) ||
      lightArray.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      ) ||
      null
    );
  };

  // 1. Hämta användardata
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/user/me");
        const data = res.data;

        setUsername(data.username || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setPassword("");
      } catch (err) {
        console.error("Kunde inte hämta användardata", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchOutfits = useCallback(async () => {
    if (!user?.username) {
      setOutfitsLoading(false);
      return;
    }
    try {
      const response = await apiClient.get<Outfit[]>(
        `/outfits/user/${user.username}`
      );
      setOutfits(response.data);
    } catch (error) {
      console.error("Kunde inte hämta outfits", error);
    } finally {
      setOutfitsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  useEffect(() => {
    const handleFocus = () => fetchOutfits();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchOutfits]);

  // 3. Spara profiländringar
  const handleSave = async () => {
    try {
      const updateData: any = {};

      if (email.trim()) updateData.email = email.trim();
      if (phone.trim()) updateData.phone = phone.trim();
      if (password.trim()) updateData.password = password.trim();

      await axios.put(`${BASE_URL}/user/update`, updateData);

      setMessage("Profilen är uppdaterad!");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Misslyckades att uppdatera profilen");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Laddar profil...</div>;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${backstage})` }}
      />

      <div className="relative z-10 flex items-center ml-20 min-h-screen gap-8">
        <h1 className="absolute top-0 ml-130 mt-30 text-amber-50 text-6xl">
          YOUR PROFILE PAGE
        </h1>

        {/* Profile form */}
        <div className="bg-purple-300/90 p-7 rounded-3xl w-80 flex flex-col mt-20">
          <label className="ml-4">Username</label>
          <input
            value={username}
            readOnly
            className="w-full border px-4 py-2 rounded-2xl text-gray-600 bg-gray-100 cursor-not-allowed mb-3"
          />

          <label className="ml-4">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black mb-3"
          />

          <label className="ml-4">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black mb-3"
          />

          <label className="ml-4">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-2xl text-black pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-900 mt-5 rounded-2xl w-20 py-2 text-amber-50 hover:bg-purple-800"
          >
            Save
          </button>

          {message && (
            <p className="text-center text-white mt-3">{message}</p>
          )}
        </div>

        {/* Saved outfits */}
        <div className="bg-purple-300/90 p-5 rounded-3xl w-96 flex flex-col gap-4 ml-40 mt-20">
          <h2 className="text-xl font-bold text-center text-purple-900">
            Sparade Outfits
          </h2>

          {outfitsLoading ? (
            <p className="text-center">Laddar outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center">Inga sparade outfits</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {outfits.map((outfit) => {
                const topItem = findClothingItem(outfit.top_id, "top");
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom");

                return (
                  <div
                    key={outfit._id}
                    className="bg-white/80 p-4 rounded-2xl border-2 border-purple-700 hover:scale-[1.02] transition-transform"
                  >
                    <div className="relative w-full h-48">
                      {bottomItem && (
                        <img
                          src={bottomItem.image}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                      {topItem && (
                        <img
                          src={topItem.image}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                    </div>

                    <div className="mt-2 text-sm">
                      <p>Tröja: {outfit.top_id}</p>
                      <p>Byxor: {outfit.bottom_id}</p>
                      <p className="text-xs">
                        Ratings: {outfit.ratings?.length || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;