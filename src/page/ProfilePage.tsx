// src/page/ProfilePage.tsx
import React, { useState } from "react";
import backstage from "../assets/backstage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProfile } from "../hooks/useProfile";
import { findClothingItem } from "../utils/clothingUtils";

function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const { 
    profileData, setProfileData, password, setPassword, 
    message, outfits, outfitsLoading, loading, handleSave 
  } = useProfile();

  if (loading) return <LoadingSpinner />;
  // Outfits
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);

  // Hitta kläder
  const findClothingItem = (identifier: string, type: "top" | "bottom", skin?: "dark" | "light") => {
    const dark = type === "top" ? tops.dark : bottoms.dark;
    const light = type === "top" ? tops.light : bottoms.light;

    // Försök inferera skin från identifier om det inte är specificerat
    let inferredSkin = skin;
    if (!inferredSkin) {
      // Kolla om identifier innehåller "Light" eller "Dark"
      if (identifier.includes("Light") || identifier.includes("light")) {
        inferredSkin = "light";
      } else if (identifier.includes("Dark") || identifier.includes("dark")) {
        inferredSkin = "dark";
      }
    }

    // Om skin är specificerad (explicit eller infererad), sök ENDAST i den samlingen
    if (inferredSkin === "light" || inferredSkin === "dark") {
      const collection = inferredSkin === "dark" ? dark : light;
      
      // Först försök hitta via id
      const foundById = collection.find(i => i.id === identifier);
      if (foundById) return foundById;
      
      // Fallback till name
      const foundByName = collection.find(i => i.name.toLowerCase() === identifier.toLowerCase());
      if (foundByName) return foundByName;
      
      return null;
    }

    // Om inget skin kan infereras (bakåtkompatibilitet), sök i båda
    // Men varning: detta kan ge fel resultat om samma ID finns i båda
    // Försök hitta i light först om möjligt (för att undvika att alltid hitta dark)
    const foundByIdLight = light.find(i => i.id === identifier);
    if (foundByIdLight) return foundByIdLight;
    
    const foundByIdDark = dark.find(i => i.id === identifier);
    if (foundByIdDark) return foundByIdDark;

    // Fallback till name (för bakåtkompatibilitet med gamla sparade outfits)
    const foundByNameLight = light.find(i => i.name.toLowerCase() === identifier.toLowerCase());
    if (foundByNameLight) return foundByNameLight;
    
    const foundByNameDark = dark.find(i => i.name.toLowerCase() === identifier.toLowerCase());
    if (foundByNameDark) return foundByNameDark;

    return null;
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
      setMessage("Profile updated!");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Oops! Profile update failed");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${backstage})` }} />
      
      <div className="relative z-10 flex flex-row items-center justify-center min-h-screen p-2 md:p-0 gap-2 md:gap-8 flex-wrap">
        <h1 className="text-lg md:text-4xl lg:text-6xl text-amber-50 mb-2 md:mb-0 md:absolute md:top-0 md:left-1/2 md:transform md:-translate-x-1/2 md:ml-0 md:mt-30">
          YOUR PROFILE PAGE
        </h1>

        {/* Profilformulär */}
        <div className="bg-purple-300/90 p-4 md:p-7 rounded-2xl w-full max-w-xs md:max-w-sm flex flex-col mt-10 shadow-2xl">
          <label className="ml-2 text-xs md:text-sm font-semibold">Username</label>
          <input value={profileData.username} readOnly className="w-full border px-4 py-2 rounded-xl text-gray-500 bg-gray-100 cursor-not-allowed mb-3" />

          <label className="ml-2 text-xs md:text-sm font-semibold">Email</label>
          <input 
            value={profileData.email} 
            onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
            className="w-full border px-4 py-2 rounded-xl mb-3" 
          />

          <label className="ml-2 text-xs md:text-sm font-semibold">Phone number</label>
          <input 
            value={profileData.phone} 
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
            className="w-full border px-4 py-2 rounded-xl mb-3" 
          />

          <label className="ml-2 text-xs md:text-sm font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </span>
          </div>

          <button onClick={handleSave} className="bg-purple-900 mt-5 rounded-xl py-2 text-amber-50 hover:bg-purple-800 transition">
            Save
          </button>
          {message && <p className="text-center text-purple-900 font-bold mt-3 text-sm">{message}</p>}
        </div>

        {/* Sparade outfits */}
        <div className="bg-purple-300/90 p-4 md:p-5 rounded-2xl w-full max-w-sm md:max-w-md flex flex-col gap-4 mt-10 md:ml-10 shadow-2xl">
          <h2 className="text-xl font-bold text-center text-purple-900">Saved Outfits</h2>
          {outfitsLoading ? (
            <p className="text-center">Loading outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center">No saved outfits</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {outfits.map((outfit) => {
                const topItem = findClothingItem(outfit.top_id, "top");
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom");
                const topItem = findClothingItem(outfit.top_id, "top", outfit.skin);
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom", outfit.skin);

                return (
                  <div key={outfit._id} className="bg-white/80 p-4 rounded-xl border-2 border-purple-700">
                    <div className="relative w-full h-32 md:h-40">
                      {bottomItem && <img src={bottomItem.image} className="absolute inset-0 w-full h-full object-contain" />}
                      {topItem && <img src={topItem.image} className="absolute inset-0 w-full h-full object-contain" />}
                    </div>
                    <div className="mt-2 text-xs text-gray-700">
                      <p><strong>Top:</strong> {outfit.top_id}</p>
                      <p><strong>Bottom:</strong> {outfit.bottom_id}</p>
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