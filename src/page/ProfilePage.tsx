// src/page/ProfilePage.tsx
import { useState } from "react";
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

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${backstage})` }} />

      
      <div className="relative z-10 flex flex-row items-center justify-center min-h-screen p-2 md:p-0 gap-2 md:gap-8 flex-wrap">
        <h1 className="absolute top-20 left-1/2 -translate-x-1/2 text-lg md:text-4xl lg:text-6xl text-amber-50 whitespace-nowrap md:top-0 md:mt-30">
          YOUR PROFILE PAGE
        </h1>

        {/* Profilformulär */}
        <div className="mt-30 md:mt-10 flex w-full max-w-[280px] flex-col rounded-2xl bg-purple-300/90 p-4 shadow-2xl sm:max-w-xs md:max-w-sm md:p-7">
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
        <div className="mt-10 flex w-full max-w-[280px] flex-col rounded-2xl bg-purple-300/90 p-4 shadow-2xl sm:max-w-xs md:max-w-sm md:p-7">
          <h2 className="text-xl font-bold text-center text-purple-900">Saved Outfits</h2>
          {outfitsLoading ? (
            <p className="text-center">Loading outfits...</p>
          ) : outfits.length === 0 ? (
            <p className="text-center">No saved outfits</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {outfits.map((outfit) => {

                const topItem = findClothingItem(outfit.top_id, "top", outfit.skin); 
                const bottomItem = findClothingItem(outfit.bottom_id, "bottom", outfit.skin);
                return (
                  <div key={outfit._id} className="bg-white/80 p-4 rounded-xl border-2 border-purple-700">
                    <div className="relative w-full h-32 md:h-40">
                      {bottomItem && <img src={bottomItem.image} className="absolute inset-0 w-full h-full object-contain" />}
                      {topItem && <img src={topItem.image} className="absolute inset-0 w-full h-full object-contain" />}
                    </div>
                    <div className="mt-2 text-xs text-gray-700">
                      <p><strong>Top:</strong> {topItem ? topItem.name : "Unknown Top"}</p>
                      <p><strong>Bottom:</strong> {bottomItem ? bottomItem.name : "Unknown Bottom"}</p>
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