// src/page/GamePage.tsx

import React, { useState, useMemo, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Shirt, Users, } from "lucide-react";
import runway from "../assets/runway,new.png"
import apiClient from "../api/client";
import { AuthContext } from "../contexts/AuthContext";

// Datatyper
type ClothingItem = { id?: string; name: string; image: string };
type ClothingCollection = { dark: ClothingItem[]; light: ClothingItem[] };


type Props = {
  tops: ClothingCollection;
  bottoms: ClothingCollection;
};

const GamePage: React.FC<Props> = ({ tops, bottoms }) => {
  const [selectedSkin, setSelectedSkin] = useState<"dark" | "light">("dark");
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const { user } = useContext(AuthContext);

    useEffect(() => {
    setCurrentTopIndex(0);
    setCurrentBottomIndex(0);
  }, [selectedSkin]);


  const currentTopsArray = useMemo(() => tops[selectedSkin], [tops, selectedSkin]);
  const currentBottomsArray = useMemo(() => bottoms[selectedSkin], [bottoms, selectedSkin]);

  const currentTop = currentTopsArray[currentTopIndex];
  const currentBottom = currentBottomsArray[currentBottomIndex];

  const handleSaveOutfit = async () => {
    if (!user || !currentTop || !currentBottom) {
      return;
    }

    setSaveStatus("saving");
    try {
      await apiClient.post("/outfits", {
        username: user.username,
        top_id: currentTop.id || currentTop.name,
        bottom_id: currentBottom.id || currentBottom.name,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save outfit", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const nextTop = () =>
  setCurrentTopIndex((i) => (i + 1) % currentTopsArray.length);
  const prevTop = () =>
  setCurrentTopIndex((i) => (i - 1 + currentTopsArray.length) % currentTopsArray.length);

  const nextBottom = () =>
  setCurrentBottomIndex((i) => (i + 1) % currentBottomsArray.length);
  const prevBottom = () =>
  setCurrentBottomIndex((i) => (i - 1 + currentBottomsArray.length) % currentBottomsArray.length);


  const CarouselControls: React.FC<{
    onClickPrev: () => void;
    onClickNext: () => void;
    icon: React.ReactNode;
    title: string;
    currentName: string;
  }> = ({ onClickPrev, onClickNext, icon, title, currentName }) => (
    <div className="flex items-center space-x-1 md:space-x-2">
      <button
        onClick={onClickPrev}
        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-700 transition touch-manipulation"
        aria-label={`Previous ${title}`}
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <div className="w-14 h-14 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border-2 border-purple-900 flex flex-col items-center justify-center text-white shadow-xl p-1 md:p-1">
        <div className="text-lg md:text-3xl text-indigo-200">{icon}</div>
        <div className="text-[9px] md:text-xs text-indigo-200 font-semibold mt-0 md:mt-1">{title}</div>
        <div className="text-[7px] md:text-[10px] text-gray-400 italic truncate w-full text-center px-0.5">
          {currentName}
        </div>
      </div>

      <button
        onClick={onClickNext}
        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 active:bg-indigo-700 transition touch-manipulation"
        aria-label={`Next ${title}`}
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-2 md:px-4 md:py-0 overflow-x-hidden"
      style={{
        backgroundImage: `url(${runway})`,
      }}
    >
      {/* SPELOMRÅDE */}
      <div className="relative w-full max-w-6xl h-[400px] md:h-[520px] flex items-center justify-center">
        {/* VÄNSTER KONTROLLER */}
        <div className="absolute left-0 md:left-0 flex flex-col space-y-1 md:space-y-4 z-20">
          <CarouselControls
            onClickPrev={prevTop}
            onClickNext={nextTop}
            icon={<Shirt />}
            title="Tröja"
            currentName={currentTop?.name || "Ingen"}
          />

          <CarouselControls
            onClickPrev={prevBottom}
            onClickNext={nextBottom}
            icon={<Users />}
            title="Byxor"
            currentName={currentBottom?.name || "Ingen"}
          />

          <div className="flex flex-col items-start space-y-1 md:space-y-2 mt-2 md:mt-4">
            <button
              onClick={handleSaveOutfit}
              disabled={
                !user || !currentTop || !currentBottom || saveStatus === "saving"
              }
              className={`px-2 py-1 md:px-4 md:py-2 rounded text-white text-xs md:text-base touch-manipulation ${
                !user || !currentTop || !currentBottom
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 active:bg-green-700"
              }`}
            >
              {saveStatus === "saving" ? "Sparar..." : "Spara outfit"}
            </button>

            {!user && (
              <p className="text-[9px] md:text-xs text-red-200">
                Logga in för att spara.
              </p>
            )}

            {saveStatus === "success" && (
              <p className="text-[9px] md:text-xs text-green-200">Sparad!</p>
            )}

            {saveStatus === "error" && (
              <p className="text-[9px] md:text-xs text-red-200">
                Fel.
              </p>
            )}
          </div>
        </div>

        {/* DOCKA */}
        <div className="relative w-[180px] h-[270px] md:w-[400px] md:h-[600px] shrink-0 z-10">
          {currentBottom && (
            <img
              src={currentBottom.image}
              className="absolute inset-0 w-full h-full object-contain"
              alt="Bottom clothing"
            />
          )}
          {currentTop && (
            <img
              src={currentTop.image}
              className="absolute inset-0 w-full h-full object-contain z-10"
              alt="Top clothing"
            />
          )}
        </div>

        {/* HÖGER – SKIN */}
        <div className="absolute right-0 md:right-0 flex flex-col space-y-1 md:space-y-4 z-20">
          <button
            onClick={() => setSelectedSkin("dark")}
            disabled={selectedSkin === "dark"}
            className={`px-2 py-1 md:px-4 md:py-2 rounded text-white text-xs md:text-base touch-manipulation ${
              selectedSkin === "dark"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"
            }`}
          >
            Mörk hud
          </button>

          <button
            onClick={() => setSelectedSkin("light")}
            disabled={selectedSkin === "light"}
            className={`px-2 py-1 md:px-4 md:py-2 rounded text-white text-xs md:text-base touch-manipulation ${
              selectedSkin === "light"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"
            }`}
          >
            Ljus hud
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
