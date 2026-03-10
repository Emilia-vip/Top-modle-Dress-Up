// src/page/UsernameSelectionPage.tsx
import { useState, useContext } from "react";
import { AuthContext } from "../Auth0/AuthContext";
import runway from "../assets/runway,new.png";
import { BASE_URL } from "../constants"; // use central constant for endpoint

export default function UsernameSelectionPage() {
  const { user, updateDbUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (name.length < 3) return setError("The name must be at least 3 characters.");
    if (password.length < 4) return setError("The password must be at least 4 characters.");

    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          auth0Id: user.sub, // Unikt ID från Auth0
          username: name,
          password,
          email: user.email 
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        const savedUsername = payload?.user?.username ?? name;
        updateDbUser({ username: savedUsername });
      } else if (response.status === 400 || response.status === 409) {
        setError("The name is taken, try another one.");
      } else {
        setError("Something went wrong, try again later.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error, try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${runway})` }}>
      <div className="p-8 bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 text-center">
        <h1 className="text-2xl text-white mb-6 tracking-widest uppercase">Pick youre game name</h1>
        
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Game name…"
          className="w-full rounded-full px-5 py-3 bg-white/10 text-white border border-gray-500 focus:outline-none focus:border-pink-500 mb-4"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password..."
          className="w-full rounded-full px-5 py-3 bg-white/10 text-white border border-gray-500 focus:outline-none focus:border-pink-500 mb-4"
        />

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <button 
          onClick={handleSave}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-full transition-all"
        >
          START PLAYING
        </button>
      </div>
    </div>
  );
}