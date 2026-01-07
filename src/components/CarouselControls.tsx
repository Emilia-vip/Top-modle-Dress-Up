import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  onClickPrev: () => void;
  onClickNext: () => void;
  icon: React.ReactNode;
  title: string;
  currentName: string;
};

export const CarouselControls: React.FC<CarouselProps> = ({ 
  onClickPrev, onClickNext, icon, title, currentName 
}) => (
  <div className="flex items-center space-x-1 md:space-x-2">
    <button onClick={onClickPrev} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition">
      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
    </button>
    <div className="w-14 h-14 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-purple-900 flex flex-col items-center justify-center text-white shadow-xl p-1">
      <div className="text-lg md:text-3xl text-indigo-200">{icon}</div>
      <div className="text-[9px] md:text-xs text-indigo-200 font-semibold mt-0 md:mt-1">{title}</div>
      <div className="text-[7px] md:text-[10px] text-gray-400 italic truncate w-full text-center px-0.5">{currentName}</div>
    </div>
    <button onClick={onClickNext} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-500/80 text-white flex items-center justify-center hover:bg-indigo-600 transition">
      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
    </button>
  </div>
);