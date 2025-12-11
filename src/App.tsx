// App.tsx
import React, { useContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import authRouter from './routes/AuthRouter';
import appRouter from './routes/AppRouter';
import { AuthContext } from './contexts/AuthContext';
import { fetchClothingData } from './data/clothes';
// import GamePage from './page/GamePage';
// import { dolls, tops, bottoms } from './data/clothes';

function App() {
  const { user, loading: authLoading } = useContext(AuthContext);

  // State för att hålla den hämtade datan
  const [data, setData] = useState<any | null>(null);
  // Lokalt laddnings-state för datahämtning
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setDataLoading(true);
    fetchClothingData()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => {
        console.error('Kunde inte ladda kläddata:', error);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, []);

  // Om auth fortfarande laddar, visa något lämpligt
  if (authLoading || dataLoading) {
    return (
      <div className="App loading-screen">
        <h1>Laddar... Vänligen vänta.</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="App error-screen">
        <h1>Ett fel uppstod. Kunde inte ladda kläder.</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-start justify-center">
      {/* Rendera RouterProvider som vanligt */}
      {!authLoading && <RouterProvider router={user ? appRouter : authRouter} />}

    </div>
  );
}

export default App;
