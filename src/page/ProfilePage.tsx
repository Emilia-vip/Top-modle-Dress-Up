import { useState, useEffect, useContext, useCallback } from "react";
import backstage from "../assets/backstage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { tops, bottoms } from "../data/clothes";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  
  // Profil state
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

  // Helper funktion för att hitta kläder baserat på ID/namn
  const findClothingItem = (name: string, type: "top" | "bottom") => {
    const darkArray = type === "top" ? tops.dark : bottoms.dark;
    const lightArray = type === "top" ? tops.light : bottoms.light;
    return (
      darkArray.find((item) => item.name.toLowerCase() === name.toLowerCase()) ||
      lightArray.find((item) => item.name.toLowerCase() === name.toLowerCase()) ||
      null
    );
  };

  // 1. Hämta användardata
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/user/me");
        const data = res.data;
        
        // Mappar data (stödjer både direkt data och data.user objekt)
        setUsername(data.username || data.user?.username || "");
        setEmail(data.email || data.user?.email || "");
        setPhone(data.phone || data.user?.phone || "");
        setPassword(""); 
      } catch (err) {
        console.error("Kunde inte hämta användardata", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2. Hämta outfits
  const fetchOutfits = useCallback(async () => {
    if (!user?.username) {
      setOutfitsLoading(false);
      return;
    }
    try {
      const response = await apiClient.get<Outfit[]>(`/outfits/user/${user.username}`);
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

  // Uppdatera outfits när fönstret får fokus
  useEffect(() => {
    const handleFocus = () => fetchOutfits();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchOutfits]);

  // 3. Spara profiländringar
  const handleSave = async () => {
    try {
      setMessage("Sparar...");
      const updateData: any = {
        email: email.trim(),
        phone: phone.trim(),
      };

      if (password && password.trim().length > 0) {
        updateData.password = password.trim();
      }

      await apiClient.put("/user/update", updateData);
      setMessage("Profilen är uppdaterad!");
      setPassword(""); 
    } catch (err: any) {
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
        <h1 className="absolute top-0 ml-130 mt-30 text-amber-50 text-6xl font-bold">
          YOUR PROFILE PAGE
        </h1>

        {/* Profilformulär */}
        <div className="bg-purple-300/90 p-7 rounded-3xl w-80 flex flex-col mt-20 shadow-2xl">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Inställningar</h2>
          
          <label className="ml-4 text-sm font-bold text-purple-900">Username</label>
          <input
            value={username}
            readOnly
            className="w-full border px-4 py-2 rounded-2xl text-gray-600 bg-gray-100 cursor-not-allowed mb-3"
          />

          <label className="ml-4 text-sm font-bold text-purple-900">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black mb-3"
          />

          <label className="ml-4 text-sm font-bold text-purple-900">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black mb-3"
          />

          <label className="ml-4 text-sm font-bold text-purple-900">New Password</label>
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-2xl text-black pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-900 mt-2 rounded-2xl w-full py-2 text-amber-50 font-bold hover:bg-purple-800 transition-colors shadow-lg"
          >
            Save
          </button>

          {message && (
            <p className={`text-center mt-3 font-bold ${message.includes("Misslyckades") ? "text-red-600" : "text-purple-900"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Sparade Outfits Sektion */}
        <div className="bg-purple-300/90 p-6 rounded-3xl w-96 flex flex-col gap-4 ml-40 mt-20 shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-purple-900 border-b-2 border-purple-400 pb-2">
            Sparade Outfits
          </h2>
          
          {outfitsLoading ? (
            <p className="text-center text-purple-900 italic">Laddar outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center text-purple-900 italic">Inga sparade outfits ännu</p>
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
                    <div className="relative w-full h-48 bg-purple-50 rounded-xl overflow-hidden">
                      {bottomItem && (
                        <img
                          src={bottomItem.image}
                          alt="bottom"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                      {topItem && (
                        <img
                          src={topItem.image}
                          alt="top"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-3 text-sm text-purple-900 font-medium">
                      <p>👕 Tröja: <span className="font-bold">{outfit.top_id}</span></p>
                      <p>👖 Byxor: <span className="font-bold">{outfit.bottom_id}</span></p>
                      <p className="text-xs text-purple-700 mt-1">
                        ⭐ Ratings: {outfit.ratings?.length || 0} st
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