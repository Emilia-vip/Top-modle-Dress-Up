import { useState, useEffect } from "react";
import axios from "axios";
import backstage from "../assets/backstage.png";
import { BASE_URL } from "../constants";
function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/me`);
        const data = res.data;
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setPassword("");
        setLoading(false);
      } catch (err) {
        console.error("Kunde inte hämta användardata", err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const handleSave = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/user/update`, {
        username,
        email,
        phone,
        password,
      });
      setMessage("Profilen är uppdaterad!");
      console.log("Uppdaterad data:", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Misslyckades att uppdatera profilen");
    }
  };
  if (loading) {
    return <div className="text-white text-center mt-20">Laddar...</div>;
  }
  return (
    <div className="relative min-h-screen w-full">
      {/* Bakgrund */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${backstage})` }}
      />
      {/* Innehåll */}
      <div className="relative z-10 flex items-center ml-20 min-h-screen">
        <div className="bg-purple-300/90 p-7 rounded-3xl w-80 flex flex-col">
          <label className="ml-4">Usernamn</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />
          <label className="ml-4">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />
          <label className="ml-4">Phone number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />
          <label className="ml-4">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-2xl text-black"
          />
          <button
            onClick={handleSave}
            className="bg-purple-900 mt-5 rounded-2xl w-20 py-2 text-amber-50 hover:bg-purple-800 transition-all duration-300"
          >
            Save
          </button>
          {/* Meddelande visas här under knappen */}
          {message && (
            <p className="text-center text-white mt-3 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;