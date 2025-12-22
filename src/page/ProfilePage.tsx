import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import backstage from "../assets/backstage.png";
import avatarImage from "../assets/gröngala.png"; // <-- din avatar
import { BASE_URL } from "../constants";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { tops, bottoms } from "../data/clothes";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Rating state
  const [ratings, setRatings] = useState<number[]>([]);
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);

  // Outfits state
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);


  const handleRate = (score: number) => {
    setSelected(score);
    setRatings([...ratings, score]);
  };

  // Helper function to find clothing item by name
  const findClothingItem = (name: string, type: "top" | "bottom") => {
    // Search in both dark and light arrays
    const darkArray = type === "top" ? tops.dark : bottoms.dark;
    const lightArray = type === "top" ? tops.light : bottoms.light;
    
    const darkItem = darkArray.find(item => item.name.toLowerCase() === name.toLowerCase());
    const lightItem = lightArray.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    // Return dark if found, otherwise light, otherwise null
    return darkItem || lightItem || null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/me`);
        const data = res.data;
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setPassword("");
        setLoading(false);
      } catch (err) {
        console.error("Kunde inte hämta användardata", err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch outfits for the current user
  const fetchOutfits = useCallback(async () => {
    if (!user?.username) {
      setOutfitsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<Outfit[]>(`/outfits/user/${user.username}`);
      setOutfits(response.data);
      setOutfitsLoading(false);
    } catch (error) {
      console.error("Kunde inte hämta outfits", error);
      setOutfitsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  // Refresh outfits when window regains focus (user navigates back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.username) {
        fetchOutfits();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.username, fetchOutfits]);

  const handleDeleteOutfit = async (outfitId: string) => {
    try {
      await apiClient.delete(`/outfits/${outfitId}`);
      fetchOutfits();
    } catch (error) {
      console.error("Kunde inte radera outfit", error);
    }
  };

  const handleSave = async () => {
    try {
      const updateData: any = {};
      
      if (email.trim()) updateData.email = email.trim();
      if (phone.trim()) updateData.phone = phone.trim();
      if (password.trim()) updateData.password = password.trim();
      
      await axios.put(`${BASE_URL}/user/update`, updateData);
      
      setMessage("Profilen är uppdaterad!");
      setPassword(""); // Clear password field after successful update
    } catch (err) {
      console.error(err);
      setMessage("Misslyckades att uppdatera profilen");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Laddar...</div>;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${backstage})` }}
      />
      <div className="relative z-10 flex items-center ml-20 min-h-screen gap-8">
        <div>
          <h1 className="absolute top-0 ml-130 mt-30 text-amber-50 text-6xl">
            YOUR PROFILE PAGE
          </h1>
        </div>

        {/* Original profile inputs */}
        <div className="bg-purple-300/90 p-7 rounded-3xl w-80 flex flex-col">
          <label htmlFor="username" className="ml-4">Usernamn</label>
          <input
            id="username"
            type="text"
            value={username}
            readOnly
            className="w-full border px-4 py-2 rounded-2xl text-black bg-gray-100 cursor-not-allowed"
          />

          <label htmlFor="email" className="ml-4">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />

          <label htmlFor="phone" className="ml-4">Phone number</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />

          <label htmlFor="password" className="ml-4">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-2xl text-black pr-10"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-900 mt-5 rounded-2xl w-20 py-2 text-amber-50 hover:bg-purple-800 transition-all duration-300"
          >
            Save
          </button>

          {message && (
            <p className="text-center text-white mt-3 font-medium">{message}</p>
          )}
        </div>

        <div className="bg-purple-300/90 p-5 rounded-3xl w-56 flex flex-col items-center gap-3 ml-70">
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-purple-700">
  <img
    src={avatarImage}
    alt="User Avatar"
    className="w-full h-full object-cover object-[50%_-30%] scale-150"
  />
</div>

          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-3xl transition-colors ${
                  star <= (hovered || selected) ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => handleRate(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Saved Outfits Section */}
        <div className="bg-purple-300/90 p-5 rounded-3xl w-96 flex flex-col gap-4 ml-8">
          <h2 className="text-xl font-bold text-purple-900 text-center">Sparade Outfits</h2>
          {outfitsLoading ? (
            <div className="text-center text-purple-900">Laddar outfits...</div>
          ) : outfits.length === 0 ? (
            <div className="text-center text-purple-900">Inga sparade outfits ännu</div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
              {outfits.map((outfit) => {
                const topItem = findClothingItem(outfit.top_id, "top");
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom");
                
                return (
                  <div
                    key={outfit._id}
                    className="bg-white/80 p-4 rounded-2xl border-2 border-purple-700"
                  >
                    <div className="relative w-full h-48 flex items-center justify-center bg-gradient-to-b from-purple-100 to-purple-200 rounded-xl overflow-hidden">
                      {bottomItem && (
                        <img
                          src={bottomItem.image}
                          alt={bottomItem.name}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                      {topItem && (
                        <img
                          src={topItem.image}
                          alt={topItem.name}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-sm text-purple-900">
                      <p className="font-semibold">Tröja: {outfit.top_id}</p>
                      <p className="font-semibold">Byxor: {outfit.bottom_id}</p>
                      {outfit.ratings && outfit.ratings.length > 0 && (
                        <p className="text-xs mt-1">
                          Betyg: {outfit.ratings.length} rating(s)
                        </p>
                      )}
                      
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
