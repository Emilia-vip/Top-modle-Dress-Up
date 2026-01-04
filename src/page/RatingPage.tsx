// src/page/RatingPage.tsx
import runway from "../assets/runway,new.png";
import LoadingSpinner from "../components/LoadingSpinner";
import { OutfitCard } from "../components/OutfitCard";
import { useRating } from "../hooks/useRating";

function RatingPage() {
  const { outfits, ratedOutfits, loading, handleRate } = useRating();

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center p-4 md:p-10"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {outfits.map((outfit) => (
          <OutfitCard
            key={outfit._id}
            outfit={outfit}
            onRate={handleRate}
            isRated={ratedOutfits.has(outfit._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default RatingPage;