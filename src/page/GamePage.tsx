import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import { ChevronLeft, ChevronRight, Shirt, Users, Zap } from 'lucide-react'; 

// Definiera den förväntade datastrukturen (objekt med dark/light)
type ClothingItem = { name: string; image: string };
type ClothingCollection = { dark: ClothingItem[]; light: ClothingItem[] };
type DollCollection = { dark: string; light: string }; // Gissar att dolls är URL:er

type Props = {
  dolls: DollCollection;
  tops: ClothingCollection;
  bottoms: ClothingCollection;
};

const GamePage: React.FC<Props> = ({ dolls, tops, bottoms }) => {
  // Återinför skin-valet
  const [selectedSkin, setSelectedSkin] = useState<'dark' | 'light'>('dark');
  
  // Återinför index för karusellen
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);

  // Använd useMemo för att hämta rätt arrayer baserat på valt skin
  const currentTopsArray = useMemo(() => tops[selectedSkin], [tops, selectedSkin]);
  const currentBottomsArray = useMemo(() => bottoms[selectedSkin], [bottoms, selectedSkin]);
  const selectedDoll = dolls[selectedSkin]; // Hämta dock-URL:en

  // --- KARUSELL-LOGIK (ÅTERINFÖRD) ---
  const nextTop = () => setCurrentTopIndex((prev) => (prev + 1) % currentTopsArray.length);
  const prevTop = () => setCurrentTopIndex((prev) => (prev - 1 + currentTopsArray.length) % currentTopsArray.length);
  
  const nextBottom = () => setCurrentBottomIndex((prev) => (prev + 1) % currentBottomsArray.length);
  const prevBottom = () => setCurrentBottomIndex((prev) => (prev - 1 + currentBottomsArray.length) % currentBottomsArray.length);
  
  // Hämta aktuella plagg
  const currentTop = currentTopsArray[currentTopIndex];
  const currentBottom = currentBottomsArray[currentBottomIndex];

  const handleLogout = () => {
    console.log("Loggar ut användaren.");
    // Använd useNavigate eller din AuthContext här för att logga ut.
  };

  // NY KOMPONENT: Kontrollpanel med karusell-knappar (Behåller stilen)
  const CarouselControls: React.FC<{ 
    onClickPrev: () => void, 
    onClickNext: () => void, 
    icon: React.ReactNode, 
    title: string, 
    currentName: string 
  }> = ({ onClickPrev, onClickNext, icon, title, currentName }) => (
    <div className="flex items-center space-x-2">
        
        {/* Vänsterpil (Föregående) */}
        <button
            onClick={onClickPrev}
            className="w-8 h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition"
        >
            <ChevronLeft size={20} />
        </button>

        {/* Mitten: Ikon och Plagginfo */}
        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-purple-900 flex flex-col items-center justify-center text-white shadow-xl transition duration-150 p-1">
            <div className="text-3xl text-indigo-200">{icon}</div>
            <div className="text-xs text-indigo-200 font-semibold mt-1">{title}</div>
            <div className="text-[10px] text-gray-400 italic truncate w-full text-center">{currentName}</div>
        </div>
        
        {/* Högerpil (Nästa) */}
        <button
            onClick={onClickNext}
            className="w-8 h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition"
        >
            <ChevronRight size={20} />
        </button>
    </div>
  );


  return (
    // Använder din bakgrundsbild och färgtema
    <div
      className="min-h-screen w-full flex flex-col items-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/09/00/33/46/360_F_900334673_iPcSROckgtgBmsRh3WiUENMKxsnmfEBW.jpg')",
      }}
    >
      
      {/* 1. Huvudnavigering (Med router-länkar) */}
      <div className="w-full max-w-5xl flex justify-center py-4 z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-8 py-3 flex space-x-6 shadow-2xl">
          
          {[
            { name: 'Home', path: '/' }, 
            { name: 'Profile', path: '/profile' }, 
            { name: 'Game', path: '/game' }, 
            { name: 'Rating', path: '/rating' }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`px-5 py-2 text-white font-semibold rounded-full transition 
                        ${item.name === 'Game' ? 'bg-indigo-700' : 'bg-indigo-500/80 hover:bg-indigo-600'}`}
            >
              {item.name}
            </Link>
          ))}
          
          <button 
            onClick={handleLogout} 
            className="px-5 py-2 text-white font-semibold rounded-full bg-red-500/80 hover:bg-red-600 transition"
          >
            Logga ut
          </button>

        </div>
      </div>

      {/* 2. Spelområdet (Docka och kontroller) */}
      <div className="flex relative items-center justify-center w-full max-w-6xl h-[600px] mt-10">

        {/* Spotlight circle behind doll (Din CSS-stil) */}
        <div className="absolute w-96 h-96 border-8 border-white rounded-full opacity-60 z-10"></div>
        
        {/* KLÄDESKONTROLLER (Vänster) */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col space-y-8 z-40">
            
            {/* Topp-kontroll (Shirt) */}
            <CarouselControls 
              onClickPrev={prevTop} 
              onClickNext={nextTop} 
              icon={<Shirt />} 
              title="Tröja/Top" 
              currentName={currentTop?.name || 'Inget'}
            />
             
            {/* Bottom-kontroll (Byxor/Kjol) */}
            <CarouselControls 
              onClickPrev={prevBottom} 
              onClickNext={nextBottom} 
              icon={<Users />}
              title="Byxor/Kjol" 
              currentName={currentBottom?.name || 'Inget'}
            />

        </div>

        {/* 3. Dockans område (Centrerad Layering) */}
        <div className="doll-area relative w-[280px] h-[500px] z-30">
          
          {/* 1. BASDOCKA (z-index 10) */}
          <img 
            src={selectedDoll} 
            alt={`${selectedSkin} doll`} 
            className="absolute inset-0 w-full h-full object-contain z-10" 
          />

          {/* 2. BOTTOM (z-index 20) */}
          {currentBottom && (
            <img 
              src={currentBottom.image} 
              alt={currentBottom.name} 
              className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none" 
            />
          )}

          {/* 3. TOPP (z-index 30) */}
          {currentTop && (
            <img 
              src={currentTop.image} 
              alt={currentTop.name} 
              className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none" 
            />
          )}
        </div>

        {/* Knapparna för att byta skin (Flyttade till högerkanten) */}
        <div className="absolute right-10 flex flex-col space-y-4 z-40 top-1/2 -translate-y-1/2">
          <button 
            onClick={() => setSelectedSkin('dark')} 
            disabled={selectedSkin === 'dark'}
            className={`px-3 py-1 text-sm rounded transition ${selectedSkin === 'dark' ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            Mörk hud
          </button>
          <button 
            onClick={() => setSelectedSkin('light')} 
            disabled={selectedSkin === 'light'}
            className={`px-3 py-1 text-sm rounded transition ${selectedSkin === 'light' ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            Ljus hud
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-indigo-200">
        <p>Aktuell outfit: {currentTop?.name} & {currentBottom?.name}</p>
      </div>

    </div>
  );
};

export default GamePage;