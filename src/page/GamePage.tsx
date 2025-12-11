// page/GamePage.tsx
import React, { useState } from 'react';

type Props = {
  dolls: any;
  tops: { dark: any[]; light: any[] };
  bottoms: { dark: any[]; light: any[] };
};

const GamePage: React.FC<Props> = ({ dolls, tops, bottoms }) => {
  // välj default skin (kan göras dynamiskt senare)
  const [selectedSkin, setSelectedSkin] = useState<'dark' | 'light'>('dark');

  // index för aktuell top/bottom
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);

  // val av docka (id)
  const [selectedDollKey, setSelectedDollKey] = useState<string | null>(selectedSkin);

  const currentTopsArray = tops[selectedSkin];
  const currentBottomsArray = bottoms[selectedSkin];

  const nextTop = () => {
    setCurrentTopIndex((prev) => (prev + 1) % currentTopsArray.length);
  };

  const prevTop = () => {
    setCurrentTopIndex((prev) => (prev - 1 + currentTopsArray.length) % currentTopsArray.length);
  };

  return (
    <div className="game-page">
      <h2>Game Page - Skin: {selectedSkin}</h2>

      <div>
        <button onClick={() => setSelectedSkin('dark')}>Dark</button>
        <button onClick={() => setSelectedSkin('light')}>Light</button>
      </div>

      <div className="doll-area">
        <img src={dolls[selectedSkin].image} alt={`${selectedSkin} doll`} style={{ width: 200 }} />
        <div>
          <h3>Top</h3>
          <button onClick={prevTop}>Prev</button>
          <button onClick={nextTop}>Next</button>
          <div>
            <p>{currentTopsArray[currentTopIndex]?.name}</p>
            <img src={currentTopsArray[currentTopIndex]?.image} alt="current top" style={{ width: 100 }} />
          </div>
        </div>

        <div>
          <h3>Bottom</h3>
          <p>{currentBottomsArray[currentBottomIndex]?.name}</p>
          <img src={currentBottomsArray[currentBottomIndex]?.image} alt="current bottom" style={{ width: 100 }} />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
