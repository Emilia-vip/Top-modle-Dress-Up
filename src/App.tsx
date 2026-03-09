import { useContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import authRouter from './routes/AuthRouter';
import appRouter from './routes/AppRouter';
import { AuthContext as Auth0Context } from './Auth0/AuthContext';
import { AuthContext as LegacyAuthContext } from './contexts/AuthContext';
import { fetchClothingData } from './data/clothes';
import UsernameSelectionPage from './components/UsernameSelectionPage';


function App() {
  const { user: auth0User, loading: auth0Loading } = useContext(Auth0Context);
  const { user: legacyUser, loading: legacyLoading } = useContext(LegacyAuthContext);

  const user = legacyUser || auth0User;

  const [data, setData] = useState<unknown | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  console.log("DEBUG:", { auth0Loading, legacyLoading, dataLoading, user });

  // Ladda kläder
  useEffect(() => {
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


  // Visa laddningsskärm om Auth0 eller kläder laddas
  if (auth0Loading || legacyLoading || dataLoading) {
    return (
      <div className="App loading-screen">
        <h1>Laddar Top Model... Vänligen vänta.</h1>
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

  // if the Auth0 user exists but has not yet been assigned a username in our
  // database, prompt them to pick one. `updateDbUser` will merge the new name
  // into context so everything downstream works.
  if (auth0User && !auth0User.username) {
    return <UsernameSelectionPage />;
  }

  return (
    <div className="w-full h-screen flex items-start justify-center">
      {/* Om user finns (inloggad via Auth0), visa spelet. Annars login-sidan. */}
      <RouterProvider router={user ? appRouter(data) : authRouter} />
    </div>
  );
}

export default App;

