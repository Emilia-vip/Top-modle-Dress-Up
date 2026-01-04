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
        skin: selectedSkin,
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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-2"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="relative w-full max-w-6xl h-[400px] md:h-[520px] flex items-center justify-center">
        
        {/* VÄNSTER KONTROLLER */}
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
          
          {/* Spara-sektion */}
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

        {/* HÖGER – SKIN */}
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