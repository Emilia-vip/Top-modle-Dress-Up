import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
   const navigate = useNavigate();

    const handleLogout = () => {
    logout();
    navigate("/")
  };

  return (
    <header
      className="fixed top-3 left-0 w-full flex justify-center items-center gap-2 md:gap-6 p-2 md:p-4 bg-gray-900 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl shadow-black z-50"
    >
      {/* Navbar */}
      <div className="flex flex-wrap gap-2 md:gap-6 justify-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-white font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-base ${
              isActive ? "bg-gray-700 bg-opacity-50" : "hover:bg-gray-700 hover:bg-opacity-30"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-white font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-base ${
              isActive ? "bg-gray-700 bg-opacity-50" : "hover:bg-gray-700 hover:bg-opacity-30"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/rating"
          className={({ isActive }) =>
            `text-white font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-base ${
              isActive ? "bg-gray-700 bg-opacity-50" : "hover:bg-gray-700 hover:bg-opacity-30"
            }`
          }
        >
          Rating
        </NavLink>

        <NavLink
          to="/score"
          className={({ isActive }) =>
            `text-white font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-base ${
              isActive ? "bg-gray-700 bg-opacity-50" : "hover:bg-gray-700 hover:bg-opacity-30"
            }`
          }
        >
          Score
        </NavLink>

        <NavLink
          to="/game"
          className={({ isActive }) =>
            `text-white font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full transition-colors duration-300 text-sm md:text-base ${
              isActive ? "bg-gray-700 bg-opacity-50" : "hover:bg-gray-700 hover:bg-opacity-30"
            }`
          }
        >
          Game
        </NavLink>
      </div>

      {/* Logga ut-knapp */}
      <button
        onClick={handleLogout}
        className="ml-2 md:ml-6 px-2 md:px-4 py-1 md:py-2 bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 text-white font-semibold rounded-full shadow-lg transition-all duration-300 border border-gray-500 hover:border-white text-sm md:text-base"
      >
        Logout
      </button>
    </header>
  );
}
