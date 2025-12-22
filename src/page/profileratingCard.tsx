import { useState } from "react";

interface ProfileRatingCardProps {
  username: string;
  initialRatings?: number[];
}

function ProfileRatingCard({ username, initialRatings = [] }: ProfileRatingCardProps) {
  const [ratings, setRatings] = useState<number[]>(initialRatings);
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const handleRate = (score: number) => {
    setSelected(score);
    setRatings([...ratings, score]);
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl p-4 shadow-md w-full flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">{username}</h3>
      <p className="text-gray-700 mb-2">Genomsnittligt betyg: {averageRating.toFixed(1)}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl transition-colors ${
              star <= (hovered || selected) ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProfileRatingCard;
