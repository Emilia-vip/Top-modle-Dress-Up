import { useState, useEffect, useContext, useCallback } from "react";
import backstage from "../assets/backstage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import type { Outfit } from "../type";
import { tops, bottoms } from "../data/clothes";
import { useLoading } from "../hooks/useLoading";
import LoadingSpinner from "../components/LoadingSpinner";

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

        {/* Profile form */}
        <div className="bg-purple-300/90 p-2 md:p-7 rounded-2xl md:rounded-3xl w-full max-w-xs md:max-w-sm flex flex-col mt-0 md:mt-20 flex-shrink-0">
          <label className="ml-2 md:ml-4 text-xs md:text-base">Username</label>
          <input
            value={username}
            readOnly
            className="w-full border px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-gray-600 bg-gray-100 cursor-not-allowed mb-2 md:mb-3 text-sm md:text-base"
          />

          <label className="ml-2 md:ml-4 text-xs md:text-base">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-black mb-2 md:mb-3 text-sm md:text-base"
          />

          <label className="ml-2 md:ml-4 text-xs md:text-base">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-black mb-2 md:mb-3 text-sm md:text-base"
          />

          <label className="ml-2 md:ml-4 text-xs md:text-base">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder=""
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-black pr-8 md:pr-10 text-sm md:text-base"
            />
            <span
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-4 w-4 md:h-5 md:w-5" /> : <EyeIcon className="h-4 w-4 md:h-5 md:w-5" />}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-900 mt-3 md:mt-5 rounded-xl md:rounded-2xl w-16 md:w-20 py-1.5 md:py-2 text-amber-50 hover:bg-purple-800 text-xs md:text-base"
          >
            Save
          </button>

          {message && (
            <p className="text-center text-white mt-2 md:mt-3 text-xs md:text-base">{message}</p>
          )}
        </div>

        {/* Saved outfits */}
        <div className="bg-purple-300/90 p-2 md:p-5 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md flex flex-col gap-2 md:gap-4 mt-2 md:mt-20 md:ml-40 flex-shrink-0">
          <h2 className="text-sm md:text-xl font-bold text-center text-purple-900">
            Saved Outfits
          </h2>

          {outfitsLoading ? (
            <p className="text-center text-xs md:text-base">Loading outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center text-xs md:text-base">No saved outfits</p>
          ) : (
            <div className="flex flex-col gap-2 md:gap-4">
              {outfits.map((outfit) => {
                const topItem = findClothingItem(outfit.top_id, "top", outfit.skin);
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom", outfit.skin);

                return (
                  <div
                    key={outfit._id}
                    className="bg-white/80 p-2 md:p-4 rounded-xl md:rounded-2xl border-2 border-purple-700 hover:scale-[1.02] transition-transform"
                  >
                    <div className="relative w-full h-24 md:h-48">
                      {bottomItem && (
                        <img
                          src={bottomItem.image}
                          className="absolute inset-0 w-full h-full object-contain mt-1 md:mt-4 scale-110 md:scale-130"
                        />
                      )}
                      {topItem && (
                        <img
                          src={topItem.image}
                          className="absolute inset-0 w-full h-full object-contain mt-1 md:mt-4 scale-110 md:scale-130"
                        />
                      )}
                    </div>
                    <div className="mt-1 md:mt-2 text-[10px] md:text-sm">
                      <p>Top: {outfit.top_id}</p>
                      <p>Bottom: {outfit.bottom_id}</p>
                      <p className="text-[9px] md:text-xs">
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
