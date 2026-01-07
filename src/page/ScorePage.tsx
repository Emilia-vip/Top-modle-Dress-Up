import runway from "../assets/runway,new.png";
import { useScores } from "../hooks/useScores";
import { PodiumPlace } from "../components/PodiumPlace";

function ScorePage() {
  const { topUsers, loading } = useScores();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${runway})` }}>
        <div className="text-white text-xl">Loading scores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 md:px-10 py-2 md:py-10" style={{ backgroundImage: `url(${runway})` }}>
      <div className="flex flex-row items-end gap-1 md:gap-16 justify-center">
        
        {/* 2nd Place */}
        {topUsers[1] && (
          <PodiumPlace 
            user={topUsers[1]} 
            rank="2nd" 
            sizeClasses={{ container: "w-14 md:w-28 lg:w-36 h-20 md:h-42 lg:h-52", text: "text-xs md:text-xl", rankText: "text-[10px] md:text-base" }} 
          />
        )}

        {/* 1st Place */}
        {topUsers[0] && (
          <PodiumPlace 
            user={topUsers[0]} 
            rank="1st" 
            sizeClasses={{ container: "w-20 md:w-36 lg:w-48 h-30 md:h-54 lg:h-80", text: "text-sm md:text-2xl lg:text-3xl", rankText: "text-xs md:text-base lg:text-xl" }} 
          />
        )}

        {/* 3rd Place */}
        {topUsers[2] && (
          <PodiumPlace 
            user={topUsers[2]} 
            rank="3rd" 
            sizeClasses={{ container: "w-12 md:w-24 lg:w-32 h-18 md:h-36 lg:h-48", text: "text-[10px] md:text-lg", rankText: "text-[9px] md:text-sm" }} 
          />
        )}
      </div>
    </div>
  );
}

export default ScorePage;