// src/page/UsernameSelectionPage.tsx
import { useState, useContext } from "react";
import { AuthContext } from "../Auth0/AuthContext";
import runway from "../assets/runway,new.png";

export default function UsernameSelectionPage({ onComplete }: { onComplete: () => void }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (name.length < 3) return setError("Namnet måste vara minst 3 tecken");

    const response = await fetch("http://localhost:3002/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        auth0Id: user.sub, // Unikt ID från Auth0
        username: name,
        email: user.email 
      }),
    });

    if (response.ok) {
      onComplete(); // Detta triggar setHasUsername(true) i App.tsx
    } else {
      setError("Namnet är upptaget, prova ett annat!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${runway})` }}>
      <div className="p-8 bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 text-center">
        <h1 className="text-2xl text-white mb-6 tracking-widest uppercase">Välj ditt namn</h1>
        
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Modellnamn..."
          className="w-full rounded-full px-5 py-3 bg-white/10 text-white border border-gray-500 focus:outline-none focus:border-pink-500 mb-4"
        />

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <button 
          onClick={handleSave}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-full transition-all"
        >
          BÖRJA SPELA
        </button>
      </div>
    </div>
  );
}