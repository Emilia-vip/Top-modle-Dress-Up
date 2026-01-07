// src/page/GamePage.tsx
import React from "react";
import { Shirt, Users } from "lucide-react";
import runway from "../assets/runway,new.png";
import { CarouselControls } from "../components/CarouselControls";
import { useGameLogic } from "../hooks/useGameLogic";
import type { ClothingCollection } from "../type";

type Props = {
  tops: ClothingCollection;
  bottoms: ClothingCollection;
};

const GamePage: React.FC<Props> = ({ tops, bottoms }) => {
  const { 
    selectedSkin, setSelectedSkin, currentTop, currentBottom, 
    saveStatus, user, handlers 
  } = useGameLogic(tops, bottoms);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-2"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="relative w-full max-w-6xl h-[400px] md:h-[520px] flex items-center justify-center">
        
        {/* VÄNSTER SIDA KONTROLLER */}
        <div className="absolute left-0 flex flex-col space-y-1 md:space-y-4 z-20">
          <CarouselControls
            onClickPrev={handlers.prevTop}
            onClickNext={handlers.nextTop}
            icon={<Shirt />}
            title="TOP"
            currentName={currentTop?.name || "Ingen"}
          />
          <CarouselControls
            onClickPrev={handlers.prevBottom}
            onClickNext={handlers.nextBottom}
            icon={<Users />}
            title="BOTTOM"
            currentName={currentBottom?.name || "Ingen"}
          />
          
          {/* Spara-knapp */}
          <div className="mt-2 md:mt-4">
            <button
              onClick={handlers.handleSaveOutfit}
              disabled={!user || !currentTop || !currentBottom || saveStatus === "saving"}
              className={`px-4 py-2 rounded text-white text-xs md:text-base ${
                !user ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {saveStatus === "saving" ? "Saving..." : "Save outfit"}
            </button>
            {!user && <p className="text-[9px] text-red-200">Log in to save.</p>}
          </div>
        </div>

        {/* DOCKA */}
        <div className="relative w-[180px] h-[270px] md:w-[400px] md:h-[600px] z-10">
          {currentBottom && <img src={currentBottom.image} className="absolute inset-0 w-full h-full object-contain" alt="Bottom" />}
          {currentTop && <img src={currentTop.image} className="absolute inset-0 w-full h-full object-contain z-10" alt="Top" />}
        </div>

        {/* HÖGER SIDA SKIN */}
        <div className="absolute right-0 flex flex-col space-y-2 z-20">
          {(["dark", "light"] as const).map((skin) => (
            <button
              key={skin}
              onClick={() => setSelectedSkin(skin)}
              disabled={selectedSkin === skin}
              className={`px-4 py-2 rounded text-white text-xs md:text-base ${
                selectedSkin === skin ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {skin.charAt(0).toUpperCase() + skin.slice(1)} skin
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;