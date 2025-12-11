import React, { useState } from 'react';


// IMPORTERA DINA TVÅ BASDOCKOR
import dollA from '../assets/base-doll-A.png'; 
import dollB from '../assets/base-doll-B.png'; 

// IMPORTERA KLÄDER (som tidigare)
import top1 from '../assets/tops/top-01-vit-t-shirt.png';
// ... (alla andra kläd-importer)

function GamePage() {
  // 1. NYTT STATE: Håller antingen 'A' eller 'B'
  const [selectedDollKey, setSelectedDollKey] = useState(null); 
  
  // 2. KLÄDER: (Samma som tidigare)
  const tops = [top1, /* ... */];
  const bottoms = [/* ... */];
  
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);

  // 3. Mappning för dockbilden
  const dollImages = {
    'A': dollA,
    'B': dollB,
  };

  // 4. Funktioner för klädnypning (samma som tidigare)
  const nextTop = () => { /* ... */ };
  const prevTop = () => { /* ... */ };
  const nextBottom = () => { /* ... */ };
  const prevBottom = () => { /* ... */ };

  // --- RENDERING LOGIK ---

  // Visa karaktärsval om ingen docka har valts
  if (!selectedDollKey) {
    return (
      <div className="game-container selection-screen">
        <h2>Välj Din Karaktär</h2>
        <div className="doll-selection-options">
          
          <div className="doll-option" onClick={() => setSelectedDollKey('A')}>
            <img src={dollA} alt="Karaktär A" className="selection-image" />
            <button>Välj Karaktär A</button>
          </div>
          
          <div className="doll-option" onClick={() => setSelectedDollKey('B')}>
            <img src={dollB} alt="Karaktär B" className="selection-image" />
            <button>Välj Karaktär B</button>
          </div>
          
        </div>
      </div>
    );
  }

  // Visa dress-up-området om en docka har valts
  return (
    <div className="game-container">
      <h1>Klä Upp Din Karaktär {selectedDollKey}</h1>

      <div className="dress-up-area">
        {/* DOCKAN: Nu använder vi den valda bilden från `dollImages` */}
        <div className="doll-display">
          <img 
            src={dollImages[selectedDollKey]} 
            alt={`Basdocka ${selectedDollKey}`} 
            className="doll-layer base-doll" 
          />
          {/* Kläderna renderas ovanpå den valda dockan */}
          <img 
            src={tops[currentTopIndex]} 
            alt="Vald topp" 
            className="doll-layer current-top" 
          />
          <img 
            src={bottoms[currentBottomIndex]} 
            alt="Vald botten" 
            className="doll-layer current-bottom" 
          />
        </div>

        {/* Kontroller för klädbyte (samma som tidigare) */}
        <div className="controls top-controls">
          <button onClick={prevTop}>&lt; Föregående Topp</button>
          <span>Topp {currentTopIndex + 1}</span>
          <button onClick={nextTop}>Nästa Topp &gt;</button>
        </div>

        <div className="controls bottom-controls">
          <button onClick={prevBottom}>&lt; Föregående Botten</button>
          <span>Botten {currentBottomIndex + 1}</span>
          <button onClick={nextBottom}>Nästa Botten &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default GamePage;