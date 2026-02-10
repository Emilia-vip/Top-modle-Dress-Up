import { jsx as _jsx } from "react/jsx-runtime";
// App.tsx
import { useContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import authRouter from './routes/AuthRouter';
import appRouter from './routes/AppRouter';
import { AuthContext } from './contexts/AuthContext';
import { fetchClothingData } from './data/clothes';
function App() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [data, setData] = useState(null);
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
    if (authLoading || dataLoading) {
        return (_jsx("div", { className: "App loading-screen", children: _jsx("h1", { children: "Laddar... V\u00E4nligen v\u00E4nta." }) }));
    }
    if (!data) {
        return (_jsx("div", { className: "App error-screen", children: _jsx("h1", { children: "Ett fel uppstod. Kunde inte ladda kl\u00E4der." }) }));
    }
    return (_jsx("div", { className: "w-full h-screen flex items-start justify-center", children: _jsx(RouterProvider, { router: user ? appRouter(data) : authRouter }) }));
}
export default App;
