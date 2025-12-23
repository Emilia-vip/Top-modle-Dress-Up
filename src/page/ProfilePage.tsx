import { useState, useEffect, useContext, useCallback } from "react";
import backstage from "../assets/backstage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { tops, bottoms } from "../data/clothes";
import axios from "axios";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  
  const { loading, setLoading } = useLoading(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Outfits
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);

  // Hitta kläder
  const findClothingItem = (name: string, type: "top" | "bottom") => {
    const dark = type === "top" ? tops.dark : bottoms.dark;
    const light = type === "top" ? tops.light : bottoms.light;

    return (
      dark.find(i => i.name.toLowerCase() === name.toLowerCase()) ||
      light.find(i => i.name.toLowerCase() === name.toLowerCase()) ||
      null
    );
  };

  // Hämta användare
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/user/me");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
        setPassword("");
      } catch (err) {
        console.error("Kunde inte hämta användardata", err);
      } finally {
        setLoading(false); // ✅ från custom hook
      }
    };

    fetchUser();
  }, [setLoading]);

  // Hämta outfits
  const fetchOutfits = useCallback(async () => {
    if (!user?.username) {
      setOutfitsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<Outfit[]>(
        `/outfits/user/${user.username}`
      );
      setOutfits(res.data);
    } catch (err) {
      console.error("Kunde inte hämta outfits", err);
    } finally {
      setOutfitsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  useEffect(() => {
    const onFocus = () => fetchOutfits();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchOutfits]);

  // Spara profil
  const handleSave = async () => {
    try {
      const updateData: any = {};
      updateData.user = user;
      if (email.trim()) updateData.email = email.trim();
      if (phone.trim()) updateData.phone = phone.trim();
      if (password.trim()) updateData.password = password.trim();

      await apiClient.post("/user/update", updateData);

      // await axios.put(`${BASE_URL}/user/update`, updateData);
      setMessage("Profilen är uppdaterad!");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Misslyckades att uppdatera profilen");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${backstage})` }} />
      <div className="relative z-10 flex flex-row items-center justify-center min-h-screen p-2 md:p-0 gap-2 md:gap-8 flex-wrap">
        <h1 className="text-3xl md:text-4xl lg:text-6xl text-amber-50 mb-4 md:mb-0 md:absolute md:top-0 md:left-1/2 md:transform md:-translate-x-1/2 md:ml-0 md:mt-30">
          YOUR PROFILE PAGE
        </h1>

        {/* Profile form */}
        <div className="bg-purple-300/90 p-3 md:p-7 rounded-3xl w-full max-w-xs md:max-w-sm flex flex-col mt-0 md:mt-20 flex-shrink-0">
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
              placeholder=""
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
        <div className="bg-purple-300/90 p-2 md:p-5 rounded-3xl w-full max-w-sm md:max-w-md flex flex-col gap-2 md:gap-4 mt-4 md:mt-20 md:ml-40 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-center text-purple-900">
            Sparade Outfits
          </h2>

          {outfitsLoading ? (
            <p className="text-center">Laddar outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center">Inga sparade outfits</p>
          ) : (
            <div className="flex flex-col gap-4">
              {outfits.map((outfit) => {
                const topItem = findClothingItem(outfit.top_id, "top");
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom");

                return (
                  <div
                    key={outfit._id}
                    className="bg-white/80 p-3 md:p-4 rounded-2xl border-2 border-purple-700 hover:scale-[1.02] transition-transform"
                  >
                    <div className="relative w-full h-32 md:h-48">
                      {bottomItem && (
                        <img
                          src={bottomItem.image}
                          className="absolute inset-0 w-full h-full object-contain mt-2 md:mt-4 scale-110 md:scale-130"
                        />
                      )}
                      {topItem && (
                        <img
                          src={topItem.image}
                          className="absolute inset-0 w-full h-full object-contain mt-2 md:mt-4 scale-110 md:scale-130"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-xs md:text-sm">
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
