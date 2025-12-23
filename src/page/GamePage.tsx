// src/page/GamePage.tsx

import React, { useState, useMemo, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Shirt, Users, } from "lucide-react";
import runway from "../assets/runway-bla.png"
import apiClient from "../api/client";
import { AuthContext } from "../contexts/AuthContext";

// Datatyper
type ClothingItem = { name: string; image: string };
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
        top_id: currentTop.name,
        bottom_id: currentBottom.name,
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
    <div className="flex items-center sace-x-2">
      <button
        onClick={onClickPrev}
        className="w-8 h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="w-24 h-24 bg-white/10 backdropreviousState-blur-sm rounded-xl border-2 border-previousStateurple-900 flex flex-col items-center justify-center text-white shadow-xl p-1">
        <div className="text-3xl text-indigo-200">{icon}</div>
        <div className="text-xs text-indigo-200 font-semibold mt-1">{title}</div>
        <div className="text-[10px] text-gray-400 italic truncate w-full text-center">
          {currentName}
        </div>
      </div>

      <button
        onClick={onClickNext}
        className="w-8 h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${runway})`,
      }}
    >
      {/* SPELOMRÅDE */}
      <div className="relative w-full max-w-6xl h-[400px] md:h-[520px] flex items-center justify-center">
        {/* VÄNSTER KONTROLLER */}
        <div className="absolute left-0 md:left-0 flex flex-col space-y-2 md:space-y-4">
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

          <div className="flex flex-col items-start space-y-2 mt-4">
            <button
              onClick={handleSaveOutfit}
              disabled={
                !user || !currentTop || !currentBottom || saveStatus === "saving"
              }
              className={`px-3 py-1 md:px-4 md:py-2 rounded text-white text-sm md:text-base ${
                !user || !currentTop || !currentBottom
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {saveStatus === "saving" ? "Sparar..." : "Spara outfit"}
            </button>

            {!user && (
              <p className="text-xs text-red-200">
                Logga in för att spara.
              </p>
            )}

            {saveStatus === "success" && (
              <p className="text-xs text-green-200">Sparad!</p>
            )}

            {saveStatus === "error" && (
              <p className="text-xs text-red-200">
                Fel.
              </p>
            )}
          </div>
        </div>

          {/* DOCKA */}
          <div className="relative w-[300px] h-[450px] mt-40">
  {currentBottom && (
    <img
      src={currentBottom.image}
      className="absolute inset-0 w-full h-full object-contain z-10"
    />
  )}
  {currentTop && (
    <img
      src={currentTop.image}
      className="absolute inset-0 w-full h-full object-contain"
    />
  )}
</div>

        {/* HÖGER – SKIN */}
        <div className="absolute right-0 md:right-0 flex flex-col space-y-2 md:space-y-4">
          <button
            onClick={() => setSelectedSkin("dark")}
            disabled={selectedSkin === "dark"}
            className={`px-3 py-1 md:px-4 md:py-2 rounded text-white text-sm md:text-base ${
              selectedSkin === "dark"
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            Mörk hud
          </button>

          <button
            onClick={() => setSelectedSkin("light")}
            disabled={selectedSkin === "light"}
            className={`px-3 py-1 md:px-4 md:py-2 rounded text-white text-sm md:text-base ${
              selectedSkin === "light"
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"
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
