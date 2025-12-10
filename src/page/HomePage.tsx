import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


function HomePage() {
  const { logout } = useContext(AuthContext);
  return (
    <div>
      <h1>Välkommen hem</h1>
      <br />
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-800 p-2 rounded-2xl"
          onClick={logout}
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}
export default HomePage;