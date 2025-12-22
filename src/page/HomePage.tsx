import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function HomePage() {
  const { logout } = useContext(AuthContext);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-10 py-10 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/09/00/33/46/360_F_900334673_iPcSROckgtgBmsRh3WiUENMKxsnmfEBW.jpg')",
      }}
    >
      <div
        className="rounded-2xl shadow-2xl shadow-black p-10 w-full max-w-3xl flex flex-col gap-5"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Titel */}
        <h1 className="text-3xl font-light text-center text-white tracking-wider mb-4 mt-8">
          Välkommen till vårt kreativa Dress-Up-spel!
        </h1>

        <p className="text-gray-200 leading-relaxed mb-6">
          Här kan du släppa fram din fantasi och skapa helt egna outfits genom att
          kombinera kläder, färger och accessoarer. Spelet är gjort för alla som
          gillar mode, styling eller bara vill ha roligt medan de designar unika looks.
        </p>

        {/* Sektion: Hur fungerar spelet */}
        <h2 className="text-2xl font-light text-white mb-4">🎮 Hur fungerar spelet?</h2>

        <div className="space-y-4 text-gray-200">

          <div>
            <h3 className="text-xl font-medium text-white">Välj en karaktär</h3>
            <p className="leading-relaxed">
              Börja med att välja den avatar du vill styla. Den fungerar som din modell
              under spelets gång.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">Utforska garderoben</h3>
            <p className="leading-relaxed">
              Bläddra bland tröjor, byxor, klänningar och skor. Varje kategori innehåller flera alternativ att prova.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">Klicka för att klä på</h3>
            <p className="leading-relaxed">
              Tryck på ett plagg för att lägga det på din karaktär. Du kan ändra hur
              mycket du vill tills du hittar den perfekta stilen.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">Spara din look</h3>
            <p className="leading-relaxed">
              När du är nöjd kan du spara din outfit eller börja om och skapa en helt
              ny stil.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white">Låt kreativiteten flöda</h3>
            <p className="leading-relaxed">
              Det finns inga rätt eller fel — spelet handlar om att experimentera,
              testa färger och skapa en stil som känns helt din egen.
            </p>
          </div>

        </div>

       
        </div>
      </div>
  );
}

export default HomePage;
